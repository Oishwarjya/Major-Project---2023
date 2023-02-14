var _a;
import { ToolButton, ToolButtonView } from "./tool_button";
export class ClickButtonView extends ToolButtonView {
    _clicked() {
        this.model.tool.do.emit(undefined);
    }
}
ClickButtonView.__name__ = "ClickButtonView";
export class ClickButton extends ToolButton {
    constructor(attrs) {
        super(attrs);
    }
}
_a = ClickButton;
ClickButton.__name__ = "ClickButton";
(() => {
    _a.prototype.default_view = ClickButtonView;
})();
//# sourceMappingURL=click_button.js.map