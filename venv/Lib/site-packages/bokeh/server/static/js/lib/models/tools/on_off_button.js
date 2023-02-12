var _a;
import { ToolButton, ToolButtonView } from "./tool_button";
import * as tools from "../../styles/tool_button.css";
export class OnOffButtonView extends ToolButtonView {
    _toggle_active() {
        this.class_list.toggle(tools.active, this.model.tool.active);
    }
    connect_signals() {
        super.connect_signals();
        const { active } = this.model.tool.properties;
        this.on_change(active, () => {
            this._toggle_active();
        });
    }
    render() {
        super.render();
        this._toggle_active();
    }
    _clicked() {
        const { active } = this.model.tool;
        this.model.tool.active = !active;
    }
}
OnOffButtonView.__name__ = "OnOffButtonView";
export class OnOffButton extends ToolButton {
    constructor(attrs) {
        super(attrs);
    }
}
_a = OnOffButton;
OnOffButton.__name__ = "OnOffButton";
(() => {
    _a.prototype.default_view = OnOffButtonView;
})();
//# sourceMappingURL=on_off_button.js.map