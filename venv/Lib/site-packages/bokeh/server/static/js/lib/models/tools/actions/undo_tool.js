var _a;
import { PlotActionTool, PlotActionToolView } from "./plot_action_tool";
import { tool_icon_undo } from "../../../styles/icons.css";
export class UndoToolView extends PlotActionToolView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.plot_view.state.changed, () => this.model.disabled = !this.plot_view.state.can_undo);
    }
    doit() {
        const state = this.plot_view.state.undo();
        if (state?.range != null) {
            this.plot_view.trigger_ranges_update_event();
        }
    }
}
UndoToolView.__name__ = "UndoToolView";
export class UndoTool extends PlotActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Undo";
        this.tool_icon = tool_icon_undo;
    }
}
_a = UndoTool;
UndoTool.__name__ = "UndoTool";
(() => {
    _a.prototype.default_view = UndoToolView;
    _a.override({
        disabled: true,
    });
    _a.register_alias("undo", () => new UndoTool());
})();
//# sourceMappingURL=undo_tool.js.map