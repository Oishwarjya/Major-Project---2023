var _a;
import { PlotActionTool, PlotActionToolView } from "./plot_action_tool";
import { tool_icon_redo } from "../../../styles/icons.css";
export class RedoToolView extends PlotActionToolView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.plot_view.state.changed, () => this.model.disabled = !this.plot_view.state.can_redo);
    }
    doit() {
        const state = this.plot_view.state.redo();
        if (state?.range != null) {
            this.plot_view.trigger_ranges_update_event();
        }
    }
}
RedoToolView.__name__ = "RedoToolView";
export class RedoTool extends PlotActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Redo";
        this.tool_icon = tool_icon_redo;
    }
}
_a = RedoTool;
RedoTool.__name__ = "RedoTool";
(() => {
    _a.prototype.default_view = RedoToolView;
    _a.override({
        disabled: true,
    });
    _a.register_alias("redo", () => new RedoTool());
})();
//# sourceMappingURL=redo_tool.js.map