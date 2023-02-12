import { CartesianFrame } from "../canvas/cartesian_frame";
import { Canvas } from "../canvas/canvas";
import { ToolProxy } from "../tools/tool_proxy";
import { LayoutDOMView } from "../layouts/layout_dom";
import { Annotation, AnnotationView } from "../annotations/annotation";
import { Title } from "../annotations/title";
import { AxisView } from "../axes/axis";
import { ToolbarPanel } from "../annotations/toolbar_panel";
import { DataRange1d } from "../ranges/data_range1d";
import { Reset } from "../../core/bokeh_events";
import { build_view, build_views, remove_views } from "../../core/build_views";
import { Visuals } from "../../core/visuals";
import { logger } from "../../core/logging";
import { RangesUpdate } from "../../core/bokeh_events";
import { throttle } from "../../core/util/throttle";
import { isBoolean, isArray } from "../../core/util/types";
import { copy, reversed } from "../../core/util/array";
import { flat_map } from "../../core/util/iterator";
import { CanvasLayer } from "../../core/util/canvas";
import { HStack, VStack, NodeLayout } from "../../core/layout/alignments";
import { BorderLayout } from "../../core/layout/border";
import { Row, Column } from "../../core/layout/grid";
import { Panel } from "../../core/layout/side_panel";
import { BBox } from "../../core/util/bbox";
import { parse_css_font_size } from "../../core/util/text";
import { RangeManager } from "./range_manager";
import { StateManager } from "./state_manager";
import { settings } from "../../core/settings";
import { StyleSheet, px } from "../../core/dom";
import plots_css from "../../styles/plots.css";
const { max } = Math;
export class PlotView extends LayoutDOMView {
    constructor() {
        super(...arguments);
        this._computed_style = new StyleSheet();
        this._outer_bbox = new BBox();
        this._inner_bbox = new BBox();
        this._needs_paint = true;
        this._invalidated_painters = new Set();
        this._invalidate_all = true;
        /*protected*/ this.renderer_views = new Map();
        /*protected*/ this.tool_views = new Map();
        this._needs_notify = false;
    }
    get canvas() {
        return this.canvas_view;
    }
    styles() {
        return [...super.styles(), plots_css, this._computed_style];
    }
    get toolbar_panel() {
        return this._toolbar != null ? this.renderer_view(this._toolbar) : undefined;
    }
    get state() {
        return this._state_manager;
    }
    set invalidate_dataranges(value) {
        this._range_manager.invalidate_dataranges = value;
    }
    renderer_view(renderer) {
        const view = this.renderer_views.get(renderer);
        if (view == null) {
            for (const [, renderer_view] of this.renderer_views) {
                const view = renderer_view.renderer_view(renderer);
                if (view != null)
                    return view;
            }
        }
        return view;
    }
    get base_font_size() {
        const font_size = getComputedStyle(this.el).fontSize;
        const result = parse_css_font_size(font_size);
        if (result != null) {
            const { value, unit } = result;
            if (unit == "px")
                return value;
        }
        return null;
    }
    *children() {
        yield* super.children();
        yield* this.renderer_views.values();
        yield* this.tool_views.values();
        yield this.canvas;
    }
    get is_paused() {
        return this._is_paused != null && this._is_paused !== 0;
    }
    get child_models() {
        return [];
    }
    pause() {
        if (this._is_paused == null)
            this._is_paused = 1;
        else
            this._is_paused += 1;
    }
    unpause(no_render = false) {
        if (this._is_paused == null)
            throw new Error("wasn't paused");
        this._is_paused = Math.max(this._is_paused - 1, 0);
        if (this._is_paused == 0 && !no_render)
            this.request_paint("everything");
    }
    notify_finished_after_paint() {
        this._needs_notify = true;
    }
    // TODO: this needs to be removed
    request_render() {
        this.request_paint("everything");
    }
    request_paint(to_invalidate) {
        this.invalidate_painters(to_invalidate);
        this.schedule_paint();
    }
    invalidate_painters(to_invalidate) {
        if (to_invalidate == "everything")
            this._invalidate_all = true;
        else if (isArray(to_invalidate)) {
            for (const renderer_view of to_invalidate)
                this._invalidated_painters.add(renderer_view);
        }
        else
            this._invalidated_painters.add(to_invalidate);
    }
    schedule_paint() {
        if (!this.is_paused) {
            const promise = this.throttled_paint();
            this._ready = this._ready.then(() => promise);
        }
    }
    request_layout() {
        this.request_paint("everything");
    }
    reset() {
        if (this.model.reset_policy == "standard") {
            this.state.clear();
            this.reset_range();
            this.reset_selection();
        }
        this.model.trigger_event(new Reset());
    }
    remove() {
        for (const r of this.frame.ranges.values()) {
            if (r instanceof DataRange1d) {
                r.plots.delete(this.model);
            }
        }
        remove_views(this.renderer_views);
        remove_views(this.tool_views);
        this.canvas_view.remove();
        super.remove();
    }
    render() {
        super.render();
        this.shadow_el.appendChild(this.canvas_view.el);
        this.canvas_view.render();
    }
    initialize() {
        this.pause();
        super.initialize();
        this.lod_started = false;
        this.visuals = new Visuals(this);
        this._initial_state = {
            selection: new Map(), // XXX: initial selection?
        };
        this.frame = new CartesianFrame(this.model.x_scale, this.model.y_scale, this.model.x_range, this.model.y_range, this.model.extra_x_ranges, this.model.extra_y_ranges, this.model.extra_x_scales, this.model.extra_y_scales);
        for (const r of this.frame.ranges.values()) {
            if (r instanceof DataRange1d) {
                r.plots.add(this.model);
            }
        }
        this._range_manager = new RangeManager(this);
        this._state_manager = new StateManager(this, this._initial_state);
        this.throttled_paint = throttle(() => { if (!this._removed)
            this.repaint(); }, 1000 / 60);
        const { title_location, title } = this.model;
        if (title_location != null && title != null) {
            this._title = title instanceof Title ? title : new Title({ text: title });
        }
        const { toolbar_location, toolbar_inner, toolbar } = this.model;
        if (toolbar_location != null) {
            this._toolbar = new ToolbarPanel({ toolbar });
            toolbar.location = toolbar_location;
            toolbar.inner = toolbar_inner;
        }
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const { hidpi, output_backend } = this.model;
        const canvas = new Canvas({ hidpi, output_backend });
        this.canvas_view = await build_view(canvas, { parent: this });
        this.canvas_view.plot_views = [this];
        await this.build_tool_views();
        await this.build_renderer_views();
        this._range_manager.update_dataranges();
    }
    box_sizing() {
        const { width_policy, height_policy, ...sizing } = super.box_sizing();
        const { frame_width, frame_height } = this.model;
        return {
            ...sizing,
            width_policy: frame_width != null && width_policy == "auto" ? "fit" : width_policy,
            height_policy: frame_height != null && height_policy == "auto" ? "fit" : height_policy,
        };
    }
    _intrinsic_display() {
        return { inner: this.model.flow_mode, outer: "grid" };
    }
    _update_layout() {
        super._update_layout();
        // TODO: invalidating all should imply "needs paint"
        this._invalidate_all = true;
        this._needs_paint = true;
        const layout = new BorderLayout();
        const { frame_align } = this.model;
        layout.aligns = (() => {
            if (isBoolean(frame_align))
                return { left: frame_align, right: frame_align, top: frame_align, bottom: frame_align };
            else {
                const { left = true, right = true, top = true, bottom = true } = frame_align;
                return { left, right, top, bottom };
            }
        })();
        layout.set_sizing({ width_policy: "max", height_policy: "max" });
        if (this.visuals.outline_line.doit) {
            const width = this.visuals.outline_line.line_width.get_value();
            layout.center_border_width = width;
        }
        const outer_above = copy(this.model.above);
        const outer_below = copy(this.model.below);
        const outer_left = copy(this.model.left);
        const outer_right = copy(this.model.right);
        const inner_above = [];
        const inner_below = [];
        const inner_left = [];
        const inner_right = [];
        const get_side = (side, inner = false) => {
            switch (side) {
                case "above": return inner ? inner_above : outer_above;
                case "below": return inner ? inner_below : outer_below;
                case "left": return inner ? inner_left : outer_left;
                case "right": return inner ? inner_right : outer_right;
            }
        };
        const { title_location } = this.model;
        if (title_location != null && this._title != null) {
            get_side(title_location).push(this._title);
        }
        if (this._toolbar != null) {
            const { location } = this._toolbar.toolbar;
            if (!this.model.toolbar_inner) {
                const panels = get_side(location);
                let push_toolbar = true;
                if (this.model.toolbar_sticky) {
                    for (let i = 0; i < panels.length; i++) {
                        const panel = panels[i];
                        if (panel instanceof Title) {
                            if (location == "above" || location == "below")
                                panels[i] = [panel, this._toolbar];
                            else
                                panels[i] = [this._toolbar, panel];
                            push_toolbar = false;
                            break;
                        }
                    }
                }
                if (push_toolbar)
                    panels.push(this._toolbar);
            }
            else {
                const panels = get_side(location, true);
                panels.push(this._toolbar);
            }
        }
        const set_layout = (side, model) => {
            const view = this.renderer_view(model);
            view.panel = new Panel(side);
            view.update_layout?.();
            return view.layout;
        };
        const set_layouts = (side, panels) => {
            const horizontal = side == "above" || side == "below";
            const layouts = [];
            for (const panel of panels) {
                if (isArray(panel)) {
                    const items = panel.map((subpanel) => {
                        const item = set_layout(side, subpanel);
                        if (subpanel instanceof ToolbarPanel) {
                            const dim = horizontal ? "width_policy" : "height_policy";
                            item.set_sizing({ ...item.sizing, [dim]: "min" });
                        }
                        return item;
                    });
                    let layout;
                    if (horizontal) {
                        layout = new Row(items);
                        layout.set_sizing({ width_policy: "max", height_policy: "min" });
                    }
                    else {
                        layout = new Column(items);
                        layout.set_sizing({ width_policy: "min", height_policy: "max" });
                    }
                    layout.absolute = true;
                    layouts.push(layout);
                }
                else
                    layouts.push(set_layout(side, panel));
            }
            return layouts;
        };
        const min_border = this.model.min_border ?? 0;
        layout.min_border = {
            left: this.model.min_border_left ?? min_border,
            top: this.model.min_border_top ?? min_border,
            right: this.model.min_border_right ?? min_border,
            bottom: this.model.min_border_bottom ?? min_border,
        };
        const center_panel = new NodeLayout();
        const top_panel = new VStack();
        const bottom_panel = new VStack();
        const left_panel = new HStack();
        const right_panel = new HStack();
        const inner_top_panel = new VStack();
        const inner_bottom_panel = new VStack();
        const inner_left_panel = new HStack();
        const inner_right_panel = new HStack();
        center_panel.absolute = true;
        top_panel.absolute = true;
        bottom_panel.absolute = true;
        left_panel.absolute = true;
        right_panel.absolute = true;
        inner_top_panel.absolute = true;
        inner_bottom_panel.absolute = true;
        inner_left_panel.absolute = true;
        inner_right_panel.absolute = true;
        center_panel.children =
            this.model.center.filter((obj) => {
                return obj instanceof Annotation;
            }).map((model) => {
                const view = this.renderer_view(model);
                view.update_layout?.();
                return view.layout;
            }).filter((layout) => {
                return layout != null;
            });
        const { frame_width, frame_height } = this.model;
        center_panel.set_sizing({
            ...(frame_width != null ? { width_policy: "fixed", width: frame_width } : { width_policy: "fit" }),
            ...(frame_height != null ? { height_policy: "fixed", height: frame_height } : { height_policy: "fit" }),
        });
        center_panel.on_resize((bbox) => this.frame.set_geometry(bbox));
        top_panel.children = reversed(set_layouts("above", outer_above));
        bottom_panel.children = set_layouts("below", outer_below);
        left_panel.children = reversed(set_layouts("left", outer_left));
        right_panel.children = set_layouts("right", outer_right);
        inner_top_panel.children = set_layouts("above", inner_above);
        inner_bottom_panel.children = set_layouts("below", inner_below);
        inner_left_panel.children = set_layouts("left", inner_left);
        inner_right_panel.children = set_layouts("right", inner_right);
        top_panel.set_sizing({ width_policy: "fit", height_policy: "min" /*, min_height: layout.min_border.top*/ });
        bottom_panel.set_sizing({ width_policy: "fit", height_policy: "min" /*, min_height: layout.min_width.bottom*/ });
        left_panel.set_sizing({ width_policy: "min", height_policy: "fit" /*, min_width: layout.min_width.left*/ });
        right_panel.set_sizing({ width_policy: "min", height_policy: "fit" /*, min_width: layout.min_width.right*/ });
        inner_top_panel.set_sizing({ width_policy: "fit", height_policy: "min" });
        inner_bottom_panel.set_sizing({ width_policy: "fit", height_policy: "min" });
        inner_left_panel.set_sizing({ width_policy: "min", height_policy: "fit" });
        inner_right_panel.set_sizing({ width_policy: "min", height_policy: "fit" });
        layout.center_panel = center_panel;
        layout.top_panel = top_panel;
        layout.bottom_panel = bottom_panel;
        layout.left_panel = left_panel;
        layout.right_panel = right_panel;
        if (inner_top_panel.children.length != 0)
            layout.inner_top_panel = inner_top_panel;
        if (inner_bottom_panel.children.length != 0)
            layout.inner_bottom_panel = inner_bottom_panel;
        if (inner_left_panel.children.length != 0)
            layout.inner_left_panel = inner_left_panel;
        if (inner_right_panel.children.length != 0)
            layout.inner_right_panel = inner_right_panel;
        this.layout = layout;
    }
    _measure_layout() {
        const { frame_width, frame_height } = this.model;
        const frame = {
            width: frame_width == null ? "1fr" : px(frame_width),
            height: frame_height == null ? "1fr" : px(frame_height),
        };
        const { layout } = this;
        const top = layout.top_panel.measure({ width: Infinity, height: Infinity });
        const bottom = layout.bottom_panel.measure({ width: Infinity, height: Infinity });
        const left = layout.left_panel.measure({ width: Infinity, height: Infinity });
        const right = layout.right_panel.measure({ width: Infinity, height: Infinity });
        const top_height = max(top.height, layout.min_border.top);
        const bottom_height = max(bottom.height, layout.min_border.bottom);
        const left_width = max(left.width, layout.min_border.left);
        const right_width = max(right.width, layout.min_border.right);
        this._computed_style.replace(`
      :host {
        grid-template-rows: ${top_height}px ${frame.height} ${bottom_height}px;
        grid-template-columns: ${left_width}px ${frame.width} ${right_width}px;
      }
    `);
    }
    get axis_views() {
        const views = [];
        for (const [, renderer_view] of this.renderer_views) {
            if (renderer_view instanceof AxisView)
                views.push(renderer_view);
        }
        return views;
    }
    update_range(range_info, options) {
        this.pause();
        this._range_manager.update(range_info, options);
        this.unpause();
    }
    reset_range() {
        this.update_range(null);
        this.trigger_ranges_update_event();
    }
    trigger_ranges_update_event() {
        const { x_range, y_range } = this.model;
        this.model.trigger_event(new RangesUpdate(x_range.start, x_range.end, y_range.start, y_range.end));
    }
    get_selection() {
        const selection = new Map();
        for (const renderer of this.model.data_renderers) {
            const { selected } = renderer.selection_manager.source;
            selection.set(renderer, selected);
        }
        return selection;
    }
    update_selection(selections) {
        for (const renderer of this.model.data_renderers) {
            const ds = renderer.selection_manager.source;
            if (selections != null) {
                const selection = selections.get(renderer);
                if (selection != null) {
                    ds.selected.update(selection, true);
                }
            }
            else
                ds.selection_manager.clear();
        }
    }
    reset_selection() {
        this.update_selection(null);
    }
    _invalidate_layout_if_needed() {
        const needs_layout = (() => {
            for (const panel of this.model.side_panels) {
                const view = this.renderer_views.get(panel);
                if (view.layout?.has_size_changed() ?? false) {
                    this.invalidate_painters(view);
                    return true;
                }
            }
            return false;
        })();
        if (needs_layout) {
            this.compute_layout();
        }
    }
    get_renderer_views() {
        return this.computed_renderers.map((r) => this.renderer_views.get(r));
    }
    *_compute_renderers() {
        const { above, below, left, right, center, renderers } = this.model;
        yield* renderers;
        yield* above;
        yield* below;
        yield* left;
        yield* right;
        yield* center;
        if (this._title != null)
            yield this._title;
        if (this._toolbar != null)
            yield this._toolbar;
        for (const [, view] of this.tool_views) {
            yield* view.overlays;
        }
    }
    async build_renderer_views() {
        this.computed_renderers = [...this._compute_renderers()];
        await build_views(this.renderer_views, this.computed_renderers, { parent: this });
    }
    async build_tool_views() {
        const tool_models = flat_map(this.model.toolbar.tools, (item) => item instanceof ToolProxy ? item.tools : [item]);
        const { created } = await build_views(this.tool_views, [...tool_models], { parent: this });
        created.map((tool_view) => this.canvas_view.ui_event_bus.register_tool(tool_view));
    }
    connect_signals() {
        super.connect_signals();
        const { extra_x_ranges, extra_y_ranges, extra_x_scales, extra_y_scales } = this.model.properties;
        this.on_change([extra_x_ranges, extra_y_ranges, extra_x_scales, extra_y_scales], () => {
            this.frame.x_range = this.model.x_range;
            this.frame.y_range = this.model.y_range;
            this.frame.in_x_scale = this.model.x_scale;
            this.frame.in_y_scale = this.model.y_scale;
            this.frame.extra_x_ranges = this.model.extra_x_ranges;
            this.frame.extra_y_ranges = this.model.extra_y_ranges;
            this.frame.extra_x_scales = this.model.extra_x_scales;
            this.frame.extra_y_scales = this.model.extra_y_scales;
            this.frame.configure_scales();
        });
        const { above, below, left, right, center, renderers } = this.model.properties;
        const panels = [above, below, left, right, center];
        this.on_change(renderers, async () => {
            await this.build_renderer_views();
        });
        this.on_change(panels, async () => {
            await this.build_renderer_views();
            this.invalidate_layout();
        });
        this.connect(this.model.toolbar.properties.tools.change, async () => {
            await this.build_tool_views();
            await this.build_renderer_views();
        });
        const { x_ranges, y_ranges } = this.frame;
        for (const [, range] of x_ranges) {
            this.connect(range.change, () => { this.request_paint("everything"); });
        }
        for (const [, range] of y_ranges) {
            this.connect(range.change, () => { this.request_paint("everything"); });
        }
        this.connect(this.model.change, () => this.request_paint("everything"));
        this.connect(this.model.reset, () => this.reset());
        const { toolbar_location } = this.model.properties;
        this.on_change(toolbar_location, async () => {
            const { toolbar_location } = this.model;
            if (this._toolbar != null) {
                if (toolbar_location != null) {
                    this._toolbar.toolbar.location = toolbar_location;
                }
                else {
                    this._toolbar = undefined;
                    await this.build_renderer_views();
                }
            }
            else {
                if (toolbar_location != null) {
                    const { toolbar, toolbar_inner } = this.model;
                    this._toolbar = new ToolbarPanel({ toolbar });
                    toolbar.location = toolbar_location;
                    toolbar.inner = toolbar_inner;
                    await this.build_renderer_views();
                }
            }
            this.invalidate_layout();
        });
        const { hold_render } = this.model.properties;
        this.on_change(hold_render, () => this._hold_render_changed());
    }
    has_finished() {
        if (!super.has_finished())
            return false;
        if (this.model.visible) {
            for (const [, renderer_view] of this.renderer_views) {
                if (!renderer_view.has_finished())
                    return false;
            }
        }
        return true;
    }
    _after_layout() {
        super._after_layout();
        this.unpause(true);
        const left = this.layout.left_panel.bbox;
        const right = this.layout.right_panel.bbox;
        const center = this.layout.center_panel.bbox;
        const top = this.layout.top_panel.bbox;
        const bottom = this.layout.bottom_panel.bbox;
        const { bbox } = this;
        const top_height = top.bottom;
        const bottom_height = bbox.height - bottom.top;
        const left_width = left.right;
        const right_width = bbox.width - right.left;
        // TODO: don't replace here; inject stylesheet?
        this.canvas.style.replace(`
      .bk-layer.bk-events {
        display: grid;
        grid-template-areas:
          ".    above  .    "
          "left center right"
          ".    below  .    ";
        grid-template-rows: ${px(top_height)} ${px(center.height)} ${px(bottom_height)};
        grid-template-columns: ${px(left_width)} ${px(center.width)} ${px(right_width)};
      }
    `);
        for (const [, child_view] of this.renderer_views) {
            if (child_view instanceof AnnotationView)
                child_view.after_layout?.();
        }
        this.model.setv({
            inner_width: Math.round(this.frame.bbox.width),
            inner_height: Math.round(this.frame.bbox.height),
            outer_width: Math.round(this.bbox.width),
            outer_height: Math.round(this.bbox.height),
        }, { no_change: true });
        if (this.model.match_aspect) {
            this.pause();
            this._range_manager.update_dataranges();
            this.unpause(true);
        }
        if (!this._outer_bbox.equals(this.bbox)) {
            this.canvas_view.resize(); // XXX temporary hack
            this._outer_bbox = this.bbox;
            this._invalidate_all = true;
            this._needs_paint = true;
        }
        const { inner_bbox } = this.layout;
        if (!this._inner_bbox.equals(inner_bbox)) {
            this._inner_bbox = inner_bbox;
            this._needs_paint = true;
        }
        if (this._needs_paint) {
            // XXX: can't be this.request_paint(), because it would trigger back-and-forth
            // layout recomputing feedback loop between plots. Plots are also much more
            // responsive this way, especially in interactive mode.
            this.paint();
        }
    }
    repaint() {
        this._invalidate_layout_if_needed();
        this.paint();
    }
    paint() {
        if (this.is_paused)
            return;
        if (this.model.visible) {
            logger.trace(`${this.toString()}.paint()`);
            this._actual_paint();
        }
        if (this._needs_notify) {
            this._needs_notify = false;
            this.notify_finished();
        }
    }
    _actual_paint() {
        const { document } = this.model;
        if (document != null) {
            const interactive_duration = document.interactive_duration();
            if (interactive_duration >= 0 && interactive_duration < this.model.lod_interval) {
                setTimeout(() => {
                    if (document.interactive_duration() > this.model.lod_timeout) {
                        document.interactive_stop();
                    }
                    this.request_paint("everything"); // TODO: this.schedule_paint()
                }, this.model.lod_timeout);
            }
            else
                document.interactive_stop();
        }
        if (this._range_manager.invalidate_dataranges) {
            this._range_manager.update_dataranges();
            this._invalidate_layout_if_needed();
        }
        let do_primary = false;
        let do_overlays = false;
        if (this._invalidate_all) {
            do_primary = true;
            do_overlays = true;
        }
        else {
            for (const painter of this._invalidated_painters) {
                const { level } = painter.model;
                if (level != "overlay")
                    do_primary = true;
                else
                    do_overlays = true;
                if (do_primary && do_overlays)
                    break;
            }
        }
        this._invalidated_painters.clear();
        this._invalidate_all = false;
        const frame_box = [
            this.frame.bbox.left,
            this.frame.bbox.top,
            this.frame.bbox.width,
            this.frame.bbox.height,
        ];
        const { primary, overlays } = this.canvas_view;
        if (do_primary) {
            primary.prepare();
            this.canvas_view.prepare_webgl(frame_box);
            this._paint_empty(primary.ctx, frame_box);
            this._paint_outline(primary.ctx, frame_box);
            this._paint_levels(primary.ctx, "image", frame_box, true);
            this._paint_levels(primary.ctx, "underlay", frame_box, true);
            this._paint_levels(primary.ctx, "glyph", frame_box, true);
            this._paint_levels(primary.ctx, "guide", frame_box, false);
            this._paint_levels(primary.ctx, "annotation", frame_box, false);
            primary.finish();
        }
        if (do_overlays || settings.wireframe) {
            overlays.prepare();
            this._paint_levels(overlays.ctx, "overlay", frame_box, false);
            if (settings.wireframe)
                this._paint_layout(overlays.ctx, this.layout);
            overlays.finish();
        }
        if (this._initial_state.range == null) {
            this._initial_state.range = this._range_manager.compute_initial() ?? undefined;
        }
        this._needs_paint = false;
    }
    _paint_levels(ctx, level, clip_region, global_clip) {
        for (const renderer of this.computed_renderers) {
            if (renderer.level != level)
                continue;
            const renderer_view = this.renderer_views.get(renderer);
            ctx.save();
            if (global_clip || renderer_view.needs_clip) {
                ctx.beginPath();
                ctx.rect(...clip_region);
                ctx.clip();
            }
            renderer_view.render();
            ctx.restore();
            if (renderer_view.has_webgl && renderer_view.needs_webgl_blit) {
                this.canvas_view.blit_webgl(ctx);
            }
        }
    }
    _paint_layout(ctx, layout) {
        const { x, y, width, height } = layout.bbox;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(x, y, width, height);
        for (const child of layout) {
            ctx.save();
            if (!layout.absolute)
                ctx.translate(x, y);
            this._paint_layout(ctx, child);
            ctx.restore();
        }
    }
    _paint_empty(ctx, frame_box) {
        const [cx, cy, cw, ch] = [0, 0, this.bbox.width, this.bbox.height];
        const [fx, fy, fw, fh] = frame_box;
        if (this.visuals.border_fill.doit) {
            this.visuals.border_fill.set_value(ctx);
            ctx.fillRect(cx, cy, cw, ch);
            ctx.clearRect(fx, fy, fw, fh);
        }
        if (this.visuals.background_fill.doit) {
            this.visuals.background_fill.set_value(ctx);
            ctx.fillRect(fx, fy, fw, fh);
        }
    }
    _paint_outline(ctx, frame_box) {
        if (this.visuals.outline_line.doit) {
            ctx.save();
            this.visuals.outline_line.set_value(ctx);
            let [x0, y0, w, h] = frame_box;
            // XXX: shrink outline region by 1px to make right and bottom lines visible
            // if they are on the edge of the canvas.
            if (x0 + w == this.bbox.width) {
                w -= 1;
            }
            if (y0 + h == this.bbox.height) {
                h -= 1;
            }
            ctx.strokeRect(x0, y0, w, h);
            ctx.restore();
        }
    }
    export(type = "auto", hidpi = true) {
        const output_backend = (() => {
            switch (type) {
                case "auto": return this.canvas_view.model.output_backend;
                case "png": return "canvas";
                case "svg": return "svg";
            }
        })();
        const composite = new CanvasLayer(output_backend, hidpi);
        const { width, height } = this.bbox;
        composite.resize(width, height);
        if (width != 0 && height != 0) {
            const { canvas } = this.canvas_view.compose();
            composite.ctx.drawImage(canvas, 0, 0);
        }
        return composite;
    }
    serializable_state() {
        const { children, ...state } = super.serializable_state();
        const renderers = this.get_renderer_views()
            .map((view) => view.serializable_state())
            .filter((item) => item.bbox != null);
        // TODO: remove this when frame is generalized
        const frame = { type: "CartesianFrame", bbox: this.frame.bbox.box };
        return { ...state, children: [...children ?? [], frame, ...renderers] };
    }
    _hold_render_changed() {
        if (this.model.hold_render) {
            this.pause();
        }
        else {
            this.unpause();
        }
    }
}
PlotView.__name__ = "PlotView";
//# sourceMappingURL=plot_canvas.js.map