import { Tool, ToolView } from "../tool";
import { OnOffButton } from "../on_off_button";
export class GestureToolView extends ToolView {
    get plot_view() {
        return this.parent;
    }
}
GestureToolView.__name__ = "GestureToolView";
export class GestureTool extends Tool {
    constructor(attrs) {
        super(attrs);
    }
    tool_button() {
        return new OnOffButton({ tool: this });
    }
}
GestureTool.__name__ = "GestureTool";
//# sourceMappingURL=gesture_tool.js.map