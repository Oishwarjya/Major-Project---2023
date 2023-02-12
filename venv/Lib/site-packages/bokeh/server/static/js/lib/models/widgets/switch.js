var _a;
import { ToggleInput, ToggleInputView } from "./toggle_input";
import { div } from "../../core/dom";
import switch_css from "../../styles/widgets/switch.css";
export class SwitchView extends ToggleInputView {
    styles() {
        return [...super.styles(), switch_css];
    }
    connect_signals() {
        super.connect_signals();
        this.el.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "Enter":
                case " ": {
                    event.preventDefault();
                    this._toggle_active();
                    break;
                }
            }
        });
        this.el.addEventListener("click", () => this._toggle_active());
    }
    render() {
        super.render();
        this.bar_el = div({ class: "bar" });
        this.knob_el = div({ class: "knob", tabIndex: 0 });
        const body_el = div({ class: "body" }, this.bar_el, this.knob_el);
        this._update_active();
        this._update_disabled();
        this.shadow_el.appendChild(body_el);
    }
    _update_active() {
        this.el.classList.toggle("active", this.model.active);
    }
    _update_disabled() {
        this.el.classList.toggle("disabled", this.model.disabled);
    }
}
SwitchView.__name__ = "SwitchView";
export class Switch extends ToggleInput {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Switch;
Switch.__name__ = "Switch";
(() => {
    _a.prototype.default_view = SwitchView;
    _a.override({
        width: 32,
    });
})();
//# sourceMappingURL=switch.js.map