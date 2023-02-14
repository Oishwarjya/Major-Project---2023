var _a;
import { PlotActionTool, PlotActionToolView } from "./plot_action_tool";
import { tool_icon_reset } from "../../../styles/icons.css";
export class ResetToolView extends PlotActionToolView {
    doit() {
        // reset() issues the RangesUpdate event
        this.plot_view.reset();
    }
}
ResetToolView.__name__ = "ResetToolView";
export class ResetTool extends PlotActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Reset";
        this.tool_icon = tool_icon_reset;
    }
}
_a = ResetTool;
ResetTool.__name__ = "ResetTool";
(() => {
    _a.prototype.default_view = ResetToolView;
    _a.register_alias("reset", () => new ResetTool());
})();
//# sourceMappingURL=reset_tool.js.map