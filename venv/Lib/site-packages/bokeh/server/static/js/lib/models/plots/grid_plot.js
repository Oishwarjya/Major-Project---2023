var _a;
import { LayoutDOM, LayoutDOMView } from "../layouts/layout_dom";
import { GridBox } from "../layouts/grid_box";
import { TracksSizing } from "../layouts/css_grid_box";
import { Toolbar } from "../tools/toolbar";
import { ActionTool } from "../tools/actions/action_tool";
import { CanvasLayer } from "../../core/util/canvas";
import { build_views, remove_views } from "../../core/build_views";
import { Location } from "../../core/enums";
export class GridPlotView extends LayoutDOMView {
    constructor() {
        super(...arguments);
        this._tool_views = new Map();
    }
    get toolbar_view() {
        return this.child_views.find((v) => v.model == this.model.toolbar);
    }
    get grid_box_view() {
        return this.child_views.find((v) => v.model == this._grid_box);
    }
    _update_location() {
        const location = this.model.toolbar_location;
        if (location == null)
            this.model.toolbar.visible = false;
        else
            this.model.toolbar.setv({ visible: true, location });
    }
    initialize() {
        super.initialize();
        this._update_location();
        const { children, rows, cols, spacing } = this.model;
        this._grid_box = new GridBox({ children, rows, cols, spacing });
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        await this.build_tool_views();
    }
    connect_signals() {
        super.connect_signals();
        const { toolbar, toolbar_location, children, rows, cols, spacing } = this.model.properties;
        this.on_change(toolbar_location, () => {
            this._update_location();
            this.rebuild();
        });
        this.on_change([toolbar, children, rows, cols, spacing], () => {
            this.rebuild();
        });
        this.on_change(this.model.toolbar.properties.tools, async () => {
            await this.build_tool_views();
        });
        this.mouseenter.connect(() => {
            this.toolbar_view.set_visibility(true);
        });
        this.mouseleave.connect(() => {
            this.toolbar_view.set_visibility(false);
        });
    }
    remove() {
        remove_views(this._tool_views);
        super.remove();
    }
    async build_tool_views() {
        const tools = this.model.toolbar.tools.filter((tool) => tool instanceof ActionTool);
        await build_views(this._tool_views, tools, { parent: this });
    }
    *children() {
        yield* super.children();
        yield* this._tool_views.values();
    }
    get child_models() {
        return [this.model.toolbar, this._grid_box];
    }
    _intrinsic_display() {
        return { inner: this.model.flow_mode, outer: "flex" };
    }
    _update_layout() {
        super._update_layout();
        const { location } = this.model.toolbar;
        const flex_direction = (() => {
            switch (location) {
                case "above": return "column";
                case "below": return "column-reverse";
                case "left": return "row";
                case "right": return "row-reverse";
            }
        })();
        this.style.append(":host", { flex_direction });
    }
    export(type = "auto", hidpi = true) {
        const output_backend = (() => {
            switch (type) {
                case "auto": // TODO: actually infer the best type
                case "png": return "canvas";
                case "svg": return "svg";
            }
        })();
        const composite = new CanvasLayer(output_backend, hidpi);
        const { x, y, width, height } = this.grid_box_view.bbox.relative();
        composite.resize(width, height);
        composite.ctx.save();
        const bg_color = getComputedStyle(this.el).backgroundColor;
        composite.ctx.fillStyle = bg_color;
        composite.ctx.fillRect(x, y, width, height);
        for (const view of this.child_views) {
            const region = view.export(type, hidpi);
            const { x, y } = view.bbox;
            composite.ctx.drawImage(region.canvas, x, y);
        }
        composite.ctx.restore();
        return composite;
    }
}
GridPlotView.__name__ = "GridPlotView";
export class GridPlot extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
}
_a = GridPlot;
GridPlot.__name__ = "GridPlot";
(() => {
    _a.prototype.default_view = GridPlotView;
    _a.define(({ Int, Number, Tuple, Array, Ref, Or, Opt, Nullable }) => ({
        toolbar: [Ref(Toolbar), () => new Toolbar()],
        toolbar_location: [Nullable(Location), "above"],
        children: [Array(Tuple(Ref(LayoutDOM), Int, Int, Opt(Int), Opt(Int))), []],
        rows: [Nullable(TracksSizing), "max-content"],
        cols: [Nullable(TracksSizing), "max-content"],
        spacing: [Or(Number, Tuple(Number, Number)), 0],
    }));
})();
//# sourceMappingURL=grid_plot.js.map