var _a;
import { PlotActionTool, PlotActionToolView } from "./plot_action_tool";
import { Dimensions } from "../../../core/enums";
import { scale_range } from "../../../core/util/zoom";
export class ZoomBaseToolView extends PlotActionToolView {
    doit() {
        const frame = this.plot_view.frame;
        const dims = this.model.dimensions;
        // restrict to axis configured in tool's dimensions property
        const h_axis = dims == "width" || dims == "both";
        const v_axis = dims == "height" || dims == "both";
        const factor = this.model.get_factor();
        const zoom_info = scale_range(frame, factor, h_axis, v_axis);
        this.plot_view.state.push("zoom_out", { range: zoom_info });
        this.plot_view.update_range(zoom_info, { scrolling: true, maintain_focus: this.model.maintain_focus });
        this.model.document?.interactive_start(this.plot_view.model);
        this.plot_view.trigger_ranges_update_event();
    }
}
ZoomBaseToolView.__name__ = "ZoomBaseToolView";
export class ZoomBaseTool extends PlotActionTool {
    constructor(attrs) {
        super(attrs);
    }
    get tooltip() {
        return this._get_dim_tooltip(this.dimensions);
    }
}
_a = ZoomBaseTool;
ZoomBaseTool.__name__ = "ZoomBaseTool";
(() => {
    _a.define(({ Percent }) => ({
        factor: [Percent, 0.1],
        dimensions: [Dimensions, "both"],
    }));
})();
//# sourceMappingURL=zoom_base_tool.js.map