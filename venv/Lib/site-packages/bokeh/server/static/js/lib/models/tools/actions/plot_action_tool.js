import { ActionTool, ActionToolView } from "./action_tool";
export class PlotActionToolView extends ActionToolView {
    get plot_view() {
        return this.parent;
    }
}
PlotActionToolView.__name__ = "PlotActionToolView";
export class PlotActionTool extends ActionTool {
    constructor(attrs) {
        super(attrs);
    }
}
PlotActionTool.__name__ = "PlotActionTool";
//# sourceMappingURL=plot_action_tool.js.map