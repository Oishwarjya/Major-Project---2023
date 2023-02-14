var _a;
import { ActionTool, ActionToolView } from "./action_tool";
import * as icons from "../../../styles/icons.css";
export class FullscreenToolView extends ActionToolView {
    doit() {
        if (document.fullscreenElement != null) {
            document.exitFullscreen();
        }
        else {
            (async () => {
                await this.parent.el.requestFullscreen();
            })();
        }
    }
}
FullscreenToolView.__name__ = "FullscreenToolView";
export class FullscreenTool extends ActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Fullscreen";
        this.tool_icon = icons.tool_icon_fullscreen;
    }
}
_a = FullscreenTool;
FullscreenTool.__name__ = "FullscreenTool";
(() => {
    _a.prototype.default_view = FullscreenToolView;
    _a.register_alias("fullscreen", () => new FullscreenTool());
})();
//# sourceMappingURL=fullscreen_tool.js.map