var _a;
import { ToggleInput, ToggleInputView } from "./toggle_input";
import { input, span } from "../../core/dom";
import checkbox_css from "../../styles/widgets/checkbox.css";
export class CheckboxView extends ToggleInputView {
    styles() {
        return [...super.styles(), checkbox_css];
    }
    connect_signals() {
        super.connect_signals();
        const { label } = this.model.properties;
        this.on_change(label, () => this._update_label());
    }
    render() {
        super.render();
        this.checkbox_el = input({ type: "checkbox" });
        this.label_el = span(this.model.label);
        this.checkbox_el.addEventListener("change", () => this._toggle_active());
        this._update_active();
        this._update_disabled();
        this.shadow_el.append(this.checkbox_el, this.label_el);
    }
    _update_active() {
        this.checkbox_el.checked = this.model.active;
    }
    _update_disabled() {
        this.checkbox_el.toggleAttribute("disabled", this.model.disabled);
    }
    _update_label() {
        this.label_el.textContent = this.model.label;
    }
}
CheckboxView.__name__ = "CheckboxView";
export class Checkbox extends ToggleInput {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Checkbox;
Checkbox.__name__ = "Checkbox";
(() => {
    _a.prototype.default_view = CheckboxView;
    _a.define(({ String }) => ({
        label: [String, ""],
    }));
})();
//# sourceMappingURL=checkbox.js.map