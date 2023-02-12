var _a;
import { ActionTool, ActionToolView } from "./action_tool";
import * as icons from "../../../styles/icons.css";
export class CustomActionView extends ActionToolView {
    doit() {
        this.model.callback?.execute(this.model);
    }
}
CustomActionView.__name__ = "CustomActionView";
export class CustomAction extends ActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Custom Action";
        this.tool_icon = icons.tool_icon_unknown;
    }
}
_a = CustomAction;
CustomAction.__name__ = "CustomAction";
(() => {
    _a.prototype.default_view = CustomActionView;
    _a.define(({ Any, Nullable }) => ({
        callback: [Nullable(Any /*TODO*/), null],
    }));
    _a.override({
        description: "Perform a Custom Action",
    });
})();
//# sourceMappingURL=custom_action.js.map