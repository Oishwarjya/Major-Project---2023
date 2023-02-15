var _a;
import { SelectTool, SelectToolView } from "./select_tool";
import { PolyAnnotation } from "../../annotations/poly_annotation";
import { tool_icon_polygon_select } from "../../../styles/icons.css";
export class PolySelectToolView extends SelectToolView {
    constructor() {
        super(...arguments);
        this.sxs = [];
        this.sys = [];
    }
    get overlays() {
        return [...super.overlays, this.model.overlay];
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.active.change, () => this._active_change());
    }
    _active_change() {
        if (!this.model.active)
            this._clear_data();
    }
    _keyup(ev) {
        if (ev.key == "Enter")
            this._clear_data();
    }
    _doubletap(ev) {
        this._do_select(this.sxs, this.sys, true, this._select_mode(ev));
        this.plot_view.state.push("poly_select", { selection: this.plot_view.get_selection() });
        this._clear_data();
    }
    _clear_data() {
        this.sxs = [];
        this.sys = [];
        this.model.overlay.clear();
    }
    _tap(ev) {
        const { sx, sy } = ev;
        const frame = this.plot_view.frame;
        if (!frame.bbox.contains(sx, sy))
            return;
        this.sxs.push(sx);
        this.sys.push(sy);
        this.model.overlay.update({ xs: this.sxs, ys: this.sys });
    }
    _do_select(sx, sy, final, mode) {
        const geometry = { type: "poly", sx, sy };
        this._select(geometry, final, mode);
    }
}
PolySelectToolView.__name__ = "PolySelectToolView";
export const DEFAULT_POLY_OVERLAY = () => {
    return new PolyAnnotation({
        level: "overlay",
        visible: false,
        xs_units: "canvas",
        ys_units: "canvas",
        fill_color: "lightgrey",
        fill_alpha: 0.5,
        line_color: "black",
        line_alpha: 1.0,
        line_width: 2,
        line_dash: [4, 4],
    });
};
export class PolySelectTool extends SelectTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Poly Select";
        this.tool_icon = tool_icon_polygon_select;
        this.event_type = "tap";
        this.default_order = 11;
    }
}
_a = PolySelectTool;
PolySelectTool.__name__ = "PolySelectTool";
(() => {
    _a.prototype.default_view = PolySelectToolView;
    _a.define(({ Ref }) => ({
        overlay: [Ref(PolyAnnotation), DEFAULT_POLY_OVERLAY],
    }));
    _a.register_alias("poly_select", () => new PolySelectTool());
})();
//# sourceMappingURL=poly_select_tool.js.map