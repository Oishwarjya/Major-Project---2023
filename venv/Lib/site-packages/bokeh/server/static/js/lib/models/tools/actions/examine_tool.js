var _a;
import { ActionTool, ActionToolView } from "./action_tool";
import * as icons from "../../../styles/icons.css";
import { Dialog } from "../../ui/dialog";
import { Examiner } from "../../ui/examiner";
import { build_view } from "../../../core/build_views";
export class ExamineToolView extends ActionToolView {
    *children() {
        yield* super.children();
        yield this._dialog;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const dialog = new Dialog({
            content: new Examiner({ target: this.parent.model }),
            closable: true,
            visible: false,
        });
        this._dialog = await build_view(dialog, { parent: this.parent });
    }
    doit() {
        this._dialog.model.visible = true;
    }
}
ExamineToolView.__name__ = "ExamineToolView";
export class ExamineTool extends ActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Examine";
        this.tool_icon = icons.tool_icon_settings; // TODO: better icon
    }
}
_a = ExamineTool;
ExamineTool.__name__ = "ExamineTool";
(() => {
    _a.prototype.default_view = ExamineToolView;
    _a.register_alias("examine", () => new ExamineTool());
})();
//# sourceMappingURL=examine_tool.js.map