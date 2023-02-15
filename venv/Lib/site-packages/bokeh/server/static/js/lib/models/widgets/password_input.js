var _a;
import { TextInput, TextInputView } from "./text_input";
import { div } from "../../core/dom";
import password_input_css from "../../styles/widgets/password_input.css";
import icons_css from "../../styles/icons.css";
export class PasswordInputView extends TextInputView {
    styles() {
        return [...super.styles(), password_input_css, icons_css];
    }
    render() {
        super.render();
        this.input_el.type = "password";
        this.toggle_el = div({ class: "bk-toggle" });
        this.toggle_el.addEventListener("click", () => {
            const { input_el, toggle_el } = this;
            const is_visible = input_el.type == "text";
            toggle_el.classList.toggle("bk-visible", !is_visible);
            input_el.type = is_visible ? "password" : "text";
        });
        this.shadow_el.append(this.toggle_el);
    }
}
PasswordInputView.__name__ = "PasswordInputView";
export class PasswordInput extends TextInput {
    constructor(attrs) {
        super(attrs);
    }
}
_a = PasswordInput;
PasswordInput.__name__ = "PasswordInput";
(() => {
    _a.prototype.default_view = PasswordInputView;
})();
//# sourceMappingURL=password_input.js.map