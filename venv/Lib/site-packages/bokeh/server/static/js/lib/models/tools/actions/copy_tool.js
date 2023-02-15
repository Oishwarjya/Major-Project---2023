var _a;
import { ActionTool, ActionToolView } from "./action_tool";
import { tool_icon_copy } from "../../../styles/icons.css";
export class CopyToolView extends ActionToolView {
    async copy() {
        const blob = await this.parent.export().to_blob();
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
    }
    doit() {
        this.copy();
    }
}
CopyToolView.__name__ = "CopyToolView";
export class CopyTool extends ActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Copy";
        this.tool_icon = tool_icon_copy;
    }
}
_a = CopyTool;
CopyTool.__name__ = "CopyTool";
(() => {
    _a.prototype.default_view = CopyToolView;
    _a.register_alias("copy", () => new CopyTool());
})();
//# sourceMappingURL=copy_tool.js.map