var _a;
import { build_view, build_views, remove_views } from "../../../core/build_views";
import { display, div, empty, span, undisplay } from "../../../core/dom";
import { Anchor, HoverMode, LinePolicy, MutedPolicy, PointPolicy, TooltipAttachment } from "../../../core/enums";
import * as hittest from "../../../core/hittest";
import { Signal } from "../../../core/signaling";
import { assert } from "../../../core/util/assert";
import { color2css, color2hex } from "../../../core/util/color";
import { enumerate } from "../../../core/util/iterator";
import { is_empty } from "../../../core/util/object";
import { FormatterType, replace_placeholders } from "../../../core/util/templating";
import { isFunction, isNumber, isString, is_undefined } from "../../../core/util/types";
import { tool_icon_hover } from "../../../styles/icons.css";
import * as styles from "../../../styles/tooltips.css";
import { Tooltip } from "../../ui/tooltip";
import { Template } from "../../dom/template";
import { HAreaView } from "../../glyphs/harea";
import { ImageBaseView } from "../../glyphs/image_base";
import { LineView } from "../../glyphs/line";
import { MultiLineView } from "../../glyphs/multi_line";
import { PatchView } from "../../glyphs/patch";
import { VAreaView } from "../../glyphs/varea";
import { DataRenderer } from "../../renderers/data_renderer";
import { GlyphRenderer } from "../../renderers/glyph_renderer";
import { GraphRenderer } from "../../renderers/graph_renderer";
import { compute_renderers } from "../../util";
import { CustomJSHover } from "./customjs_hover";
import { InspectTool, InspectToolView } from "./inspect_tool";
export function _nearest_line_hit(i, geometry, dx, dy) {
    const p1 = { x: dx[i], y: dy[i] };
    const p2 = { x: dx[i + 1], y: dy[i + 1] };
    const { sx, sy } = geometry;
    const [d1, d2] = (function () {
        if (geometry.type == "span") {
            if (geometry.direction == "h")
                return [Math.abs(p1.x - sx), Math.abs(p2.x - sx)];
            else
                return [Math.abs(p1.y - sy), Math.abs(p2.y - sy)];
        }
        // point geometry case
        const s = { x: sx, y: sy };
        const d1 = hittest.dist_2_pts(p1, s);
        const d2 = hittest.dist_2_pts(p2, s);
        return [d1, d2];
    })();
    return d1 < d2 ? [[p1.x, p1.y], i] : [[p2.x, p2.y], i + 1];
}
export function _line_hit(xs, ys, i) {
    return [[xs[i], ys[i]], i];
}
export class HoverToolView extends InspectToolView {
    constructor() {
        super(...arguments);
        this.ttmodels = new Map();
        this._ttviews = new Map();
    }
    *children() {
        yield* super.children();
        yield* this._ttviews.values();
        if (this._template_view != null)
            yield this._template_view;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        await this._update_ttmodels();
        const { tooltips } = this.model;
        if (tooltips instanceof Template) {
            this._template_view = await build_view(tooltips, { parent: this.plot_view.canvas });
            this._template_view.render();
        }
    }
    remove() {
        this._template_view?.remove();
        remove_views(this._ttviews);
        super.remove();
    }
    connect_signals() {
        super.connect_signals();
        const plot_renderers = this.plot_view.model.properties.renderers;
        const { renderers, tooltips } = this.model.properties;
        this.on_change(tooltips, () => delete this._template_el);
        this.on_change([plot_renderers, renderers, tooltips], async () => await this._update_ttmodels());
    }
    async _update_ttmodels() {
        const { ttmodels } = this;
        ttmodels.clear();
        const { tooltips } = this.model;
        if (tooltips == null)
            return;
        const { computed_renderers } = this;
        for (const r of computed_renderers) {
            const tooltip = new Tooltip({
                content: document.createElement("div"),
                attachment: this.model.attachment,
                show_arrow: this.model.show_arrow,
                interactive: false,
                visible: true,
                position: null,
                target: this.parent.canvas.overlays_el,
            });
            if (r instanceof GlyphRenderer) {
                ttmodels.set(r, tooltip);
            }
            else if (r instanceof GraphRenderer) {
                ttmodels.set(r.node_renderer, tooltip);
                ttmodels.set(r.edge_renderer, tooltip);
            }
        }
        await build_views(this._ttviews, [...ttmodels.values()], { parent: this.plot_view });
        const glyph_renderers = [...(function* () {
                for (const r of computed_renderers) {
                    if (r instanceof GlyphRenderer)
                        yield r;
                    else if (r instanceof GraphRenderer) {
                        yield r.node_renderer;
                        yield r.edge_renderer;
                    }
                }
            })()];
        const slot = this._slots.get(this.update);
        if (slot != null) {
            const except = new Set(glyph_renderers.map((r) => r.data_source));
            Signal.disconnect_receiver(this, slot, except);
        }
        for (const r of glyph_renderers) {
            this.connect(r.data_source.inspect, this.update);
        }
    }
    get computed_renderers() {
        const { renderers } = this.model;
        const all_renderers = this.plot_view.model.data_renderers;
        return compute_renderers(renderers, all_renderers);
    }
    _clear() {
        this._inspect(Infinity, Infinity);
        for (const [, tooltip] of this.ttmodels) {
            tooltip.clear();
        }
    }
    _move(ev) {
        if (!this.model.active)
            return;
        const { sx, sy } = ev;
        if (!this.plot_view.frame.bbox.contains(sx, sy))
            this._clear();
        else
            this._inspect(sx, sy);
    }
    _move_exit() {
        this._clear();
    }
    _inspect(sx, sy) {
        let geometry;
        if (this.model.mode == "mouse")
            geometry = { type: "point", sx, sy };
        else {
            const direction = this.model.mode == "vline" ? "h" : "v";
            geometry = { type: "span", direction, sx, sy };
        }
        for (const r of this.computed_renderers) {
            const sm = r.get_selection_manager();
            const rview = this.plot_view.renderer_view(r);
            if (rview != null)
                sm.inspect(rview, geometry);
        }
        this._emit_callback(geometry);
    }
    _update(renderer, geometry, tooltip) {
        const selection_manager = renderer.get_selection_manager();
        const fullset_indices = selection_manager.inspectors.get(renderer);
        const subset_indices = renderer.view.convert_selection_to_subset(fullset_indices);
        // XXX: https://github.com/bokeh/bokeh/pull/11992#pullrequestreview-897552484
        if (fullset_indices.is_empty() && fullset_indices.view == null) {
            tooltip.clear();
            return;
        }
        const ds = selection_manager.source;
        const renderer_view = this.plot_view.renderer_view(renderer);
        if (renderer_view == null)
            return;
        const { sx, sy } = geometry;
        const xscale = renderer_view.coordinates.x_scale;
        const yscale = renderer_view.coordinates.y_scale;
        const x = xscale.invert(sx);
        const y = yscale.invert(sy);
        const { glyph } = renderer_view;
        const tooltips = [];
        if (glyph instanceof PatchView) {
            const [snap_sx, snap_sy] = [sx, sy];
            const [snap_x, snap_y] = [x, y];
            const vars = {
                index: null,
                glyph_view: glyph,
                x, y, sx, sy, snap_x, snap_y, snap_sx, snap_sy,
                name: renderer.name,
            };
            const rendered = this._render_tooltips(ds, vars);
            tooltips.push([snap_sx, snap_sy, rendered]);
        }
        else if (glyph instanceof VAreaView || glyph instanceof HAreaView) {
            for (const i of subset_indices.line_indices) {
                const [snap_x, snap_y] = [x, y];
                const [snap_sx, snap_sy] = [sx, sy];
                const vars = {
                    index: i,
                    glyph_view: glyph,
                    x, y, sx, sy, snap_x, snap_y, snap_sx, snap_sy,
                    name: renderer.name,
                    indices: subset_indices.line_indices,
                };
                const rendered = this._render_tooltips(ds, vars);
                tooltips.push([snap_sx, snap_sy, rendered]);
            }
        }
        else if (glyph instanceof LineView) {
            const { line_policy } = this.model;
            for (const i of subset_indices.line_indices) {
                const [[snap_x, snap_y], [snap_sx, snap_sy], ii] = (() => {
                    const [x, y] = [glyph._x, glyph._y];
                    switch (line_policy) {
                        case "interp": {
                            const [snap_x, snap_y] = glyph.get_interpolation_hit(i, geometry);
                            const snap_sxy = [xscale.compute(snap_x), yscale.compute(snap_y)];
                            return [[snap_x, snap_y], snap_sxy, i];
                        }
                        case "prev": {
                            const [snap_sxy, ii] = _line_hit(glyph.sx, glyph.sy, i);
                            return [[x[i + 1], y[i + 1]], snap_sxy, ii];
                        }
                        case "next": {
                            const [snap_sxy, ii] = _line_hit(glyph.sx, glyph.sy, i + 1);
                            return [[x[i + 1], y[i + 1]], snap_sxy, ii];
                        }
                        case "nearest": {
                            const [snap_sxy, ii] = _nearest_line_hit(i, geometry, glyph.sx, glyph.sy);
                            return [[x[ii], y[ii]], snap_sxy, ii];
                        }
                        case "none": {
                            const xscale = renderer_view.coordinates.x_scale;
                            const yscale = renderer_view.coordinates.y_scale;
                            const x = xscale.invert(sx);
                            const y = yscale.invert(sy);
                            return [[x, y], [sx, sy], i];
                        }
                    }
                })();
                const vars = {
                    index: ii,
                    glyph_view: glyph,
                    x, y, sx, sy, snap_x, snap_y, snap_sx, snap_sy,
                    name: renderer.name,
                    indices: subset_indices.line_indices,
                };
                const rendered = this._render_tooltips(ds, vars);
                tooltips.push([snap_sx, snap_sy, rendered]);
            }
        }
        else if (glyph instanceof ImageBaseView) {
            for (const image_index of fullset_indices.image_indices) {
                const [snap_sx, snap_sy] = [sx, sy];
                const [snap_x, snap_y] = [x, y];
                const vars = {
                    index: image_index.index,
                    glyph_view: glyph,
                    x, y, sx, sy, snap_x, snap_y, snap_sx, snap_sy,
                    name: renderer.name,
                    image_index,
                };
                const rendered = this._render_tooltips(ds, vars);
                tooltips.push([snap_sx, snap_sy, rendered]);
            }
        }
        else {
            for (const i of subset_indices.indices) {
                // multiglyphs set additional indices, e.g. multiline_indices for different tooltips
                if (glyph instanceof MultiLineView && !is_empty(subset_indices.multiline_indices)) {
                    const { line_policy } = this.model;
                    for (const j of subset_indices.multiline_indices[i.toString()]) { // TODO: subset_indices.multiline_indices.get(i)
                        const [[snap_x, snap_y], [snap_sx, snap_sy], jj] = (function () {
                            if (line_policy == "interp") {
                                const [snap_x, snap_y] = glyph.get_interpolation_hit(i, j, geometry);
                                const snap_sxy = [xscale.compute(snap_x), yscale.compute(snap_y)];
                                return [[snap_x, snap_y], snap_sxy, j];
                            }
                            const [xs, ys] = [glyph._xs.get(i), glyph._ys.get(i)];
                            if (line_policy == "prev") {
                                const [snap_sxy, jj] = _line_hit(glyph.sxs.get(i), glyph.sys.get(i), j);
                                return [[xs[j], ys[j]], snap_sxy, jj];
                            }
                            if (line_policy == "next") {
                                const [snap_sxy, jj] = _line_hit(glyph.sxs.get(i), glyph.sys.get(i), j + 1);
                                return [[xs[j], ys[j]], snap_sxy, jj];
                            }
                            if (line_policy == "nearest") {
                                const [snap_sxy, jj] = _nearest_line_hit(j, geometry, glyph.sxs.get(i), glyph.sys.get(i));
                                return [[xs[jj], ys[jj]], snap_sxy, jj];
                            }
                            throw new Error("shouldn't have happened");
                        })();
                        const index = renderer.view.convert_indices_from_subset([i])[0];
                        const vars = {
                            index,
                            glyph_view: glyph,
                            x, y, sx, sy, snap_x, snap_y, snap_sx, snap_sy,
                            name: renderer.name,
                            indices: subset_indices.multiline_indices,
                            segment_index: jj,
                        };
                        const rendered = this._render_tooltips(ds, vars);
                        tooltips.push([snap_sx, snap_sy, rendered]);
                    }
                }
                else {
                    // handle non-multiglyphs
                    const snap_x = glyph._x?.[i];
                    const snap_y = glyph._y?.[i];
                    const { point_policy, anchor } = this.model;
                    const [snap_sx, snap_sy] = (function () {
                        if (point_policy == "snap_to_data") {
                            const pt = glyph.get_anchor_point(anchor, i, [sx, sy]);
                            if (pt != null)
                                return [pt.x, pt.y];
                            const ptc = glyph.get_anchor_point("center", i, [sx, sy]);
                            if (ptc != null)
                                return [ptc.x, ptc.y];
                            return [sx, sy];
                        }
                        return [sx, sy];
                    })();
                    const index = renderer.view.convert_indices_from_subset([i])[0];
                    const vars = {
                        index,
                        glyph_view: glyph,
                        x, y, sx, sy, snap_x, snap_y, snap_sx, snap_sy,
                        name: renderer.name,
                        indices: subset_indices.indices,
                    };
                    const rendered = this._render_tooltips(ds, vars);
                    tooltips.push([snap_sx, snap_sy, rendered]);
                }
            }
        }
        if (tooltips.length == 0)
            tooltip.clear();
        else {
            const { content } = tooltip;
            assert(content instanceof Element);
            empty(content);
            for (const [, , node] of tooltips) {
                if (node != null)
                    content.appendChild(node);
            }
            const [x, y] = tooltips[tooltips.length - 1];
            tooltip.setv({ position: [x, y] }, { check_eq: false }); // XXX: force update
        }
    }
    update([renderer, { geometry }]) {
        if (!this.model.active)
            return;
        if (!(geometry.type == "point" || geometry.type == "span"))
            return;
        if (this.model.muted_policy == "ignore" && renderer.muted)
            return;
        const tooltip = this.ttmodels.get(renderer);
        if (is_undefined(tooltip))
            return;
        this._update(renderer, geometry, tooltip);
    }
    _emit_callback(geometry) {
        const { callback } = this.model;
        if (callback == null)
            return;
        for (const renderer of this.computed_renderers) {
            if (!(renderer instanceof GlyphRenderer))
                continue;
            const glyph_renderer_view = this.plot_view.renderer_view(renderer);
            if (glyph_renderer_view == null)
                continue;
            const { x_scale, y_scale } = glyph_renderer_view.coordinates;
            const x = x_scale.invert(geometry.sx);
            const y = y_scale.invert(geometry.sy);
            const index = renderer.data_source.inspected;
            callback.execute(this.model, {
                geometry: { x, y, ...geometry },
                renderer,
                index,
            });
        }
    }
    _create_template(tooltips) {
        const rows = div({ style: { display: "table", borderSpacing: "2px" } });
        for (const [label] of tooltips) {
            const row = div({ style: { display: "table-row" } });
            rows.appendChild(row);
            const label_cell = div({ style: { display: "table-cell" }, class: styles.tooltip_row_label }, label.length != 0 ? `${label}: ` : "");
            row.appendChild(label_cell);
            const value_el = span();
            value_el.dataset.value = "";
            const swatch_el = span({ class: styles.tooltip_color_block }, " ");
            swatch_el.dataset.swatch = "";
            undisplay(swatch_el);
            const value_cell = div({ style: { display: "table-cell" }, class: styles.tooltip_row_value }, value_el, swatch_el);
            row.appendChild(value_cell);
        }
        return rows;
    }
    _render_template(template, tooltips, ds, vars) {
        const el = template.cloneNode(true);
        // if we have an image_index, that is what replace_placeholders needs
        const i = is_undefined(vars.image_index) ? vars.index : vars.image_index;
        const value_els = el.querySelectorAll("[data-value]");
        const swatch_els = el.querySelectorAll("[data-swatch]");
        const color_re = /\$color(\[.*\])?:(\w*)/;
        const swatch_re = /\$swatch:(\w*)/;
        for (const [[, value], j] of enumerate(tooltips)) {
            const swatch_match = value.match(swatch_re);
            const color_match = value.match(color_re);
            if (swatch_match == null && color_match == null) {
                const content = replace_placeholders(value.replace("$~", "$data_"), ds, i, this.model.formatters, vars);
                if (isString(content)) {
                    value_els[j].textContent = content;
                }
                else {
                    for (const el of content) {
                        value_els[j].appendChild(el);
                    }
                }
                continue;
            }
            if (swatch_match != null) {
                const [, colname] = swatch_match;
                const column = ds.get_column(colname);
                if (column == null) {
                    value_els[j].textContent = `${colname} unknown`;
                }
                else {
                    const color = isNumber(i) ? column[i] : null;
                    if (color != null) {
                        swatch_els[j].style.backgroundColor = color2css(color);
                        display(swatch_els[j]);
                    }
                }
            }
            if (color_match != null) {
                const [, opts = "", colname] = color_match;
                const column = ds.get_column(colname); // XXX: change to columnar ds
                if (column == null) {
                    value_els[j].textContent = `${colname} unknown`;
                    continue;
                }
                const hex = opts.indexOf("hex") >= 0;
                const swatch = opts.indexOf("swatch") >= 0;
                const color = isNumber(i) ? column[i] : null;
                if (color == null) {
                    value_els[j].textContent = "(null)";
                    continue;
                }
                value_els[j].textContent = hex ? color2hex(color) : color2css(color); // TODO: color2pretty
                if (swatch) {
                    swatch_els[j].style.backgroundColor = color2css(color);
                    display(swatch_els[j]);
                }
            }
        }
        return el;
    }
    _render_tooltips(ds, vars) {
        const { tooltips } = this.model;
        const i = vars.index;
        if (isString(tooltips)) {
            const content = replace_placeholders({ html: tooltips }, ds, i, this.model.formatters, vars);
            return div(content);
        }
        if (isFunction(tooltips))
            return tooltips(ds, vars);
        if (tooltips instanceof Template) {
            this._template_view.update(ds, i, vars);
            return this._template_view.el;
        }
        if (tooltips != null) {
            const template = this._template_el ?? (this._template_el = this._create_template(tooltips));
            return this._render_template(template, tooltips, ds, vars);
        }
        return null;
    }
}
HoverToolView.__name__ = "HoverToolView";
export class HoverTool extends InspectTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Hover";
        this.tool_icon = tool_icon_hover;
    }
}
_a = HoverTool;
HoverTool.__name__ = "HoverTool";
(() => {
    _a.prototype.default_view = HoverToolView;
    _a.define(({ Any, Boolean, String, Array, Tuple, Dict, Or, Ref, Function, Auto, Nullable }) => ({
        tooltips: [Nullable(Or(Ref(Template), String, Array(Tuple(String, String)), Function())), [
                ["index", "$index"],
                ["data (x, y)", "($x, $y)"],
                ["screen (x, y)", "($sx, $sy)"],
            ]],
        formatters: [Dict(Or(Ref(CustomJSHover), FormatterType)), {}],
        renderers: [Or(Array(Ref(DataRenderer)), Auto), "auto"],
        mode: [HoverMode, "mouse"],
        muted_policy: [MutedPolicy, "show"],
        point_policy: [PointPolicy, "snap_to_data"],
        line_policy: [LinePolicy, "nearest"],
        show_arrow: [Boolean, true],
        anchor: [Anchor, "center"],
        attachment: [TooltipAttachment, "horizontal"],
        callback: [Nullable(Any /*TODO*/), null],
    }));
    _a.register_alias("hover", () => new HoverTool());
})();
//# sourceMappingURL=hover_tool.js.map