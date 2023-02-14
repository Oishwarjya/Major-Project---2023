import { Tool, ToolView } from "../tool";
import { ClickButton } from "../click_button";
import { Signal } from "../../../core/signaling";
export class ActionToolView extends ToolView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.do, (arg) => this.doit(arg));
    }
}
ActionToolView.__name__ = "ActionToolView";
export class ActionTool extends Tool {
    constructor(attrs) {
        super(attrs);
        this.do = new Signal(this, "do");
    }
    tool_button() {
        return new ClickButton({ tool: this });
    }
}
ActionTool.__name__ = "ActionTool";
//# sourceMappingURL=action_tool.js.map