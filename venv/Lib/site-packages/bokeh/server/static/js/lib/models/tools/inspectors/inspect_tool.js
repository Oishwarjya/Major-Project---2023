var _a;
import { Tool, ToolView } from "../tool";
import { OnOffButton } from "../on_off_button";
export class InspectToolView extends ToolView {
    get plot_view() {
        return this.parent;
    }
}
InspectToolView.__name__ = "InspectToolView";
export class InspectTool extends Tool {
    constructor(attrs) {
        super(attrs);
        this.event_type = "move";
    }
    tool_button() {
        return new OnOffButton({ tool: this });
    }
}
_a = InspectTool;
InspectTool.__name__ = "InspectTool";
(() => {
    _a.define(({ Boolean }) => ({
        toggleable: [Boolean, true],
    }));
    _a.override({
        active: true,
    });
})();
//# sourceMappingURL=inspect_tool.js.map