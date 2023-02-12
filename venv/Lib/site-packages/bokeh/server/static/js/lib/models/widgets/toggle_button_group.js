var _a;
import { OrientedControl, OrientedControlView } from "./oriented_control";
import { ButtonClick } from "../../core/bokeh_events";
import { ButtonType } from "../../core/enums";
import { button, div } from "../../core/dom";
import buttons_css, * as buttons from "../../styles/buttons.css";
export class ToggleButtonGroupView extends OrientedControlView {
    *controls() {
        yield* this._buttons; // TODO: HTMLButtonElement[]
    }
    connect_signals() {
        super.connect_signals();
        const p = this.model.properties;
        this.on_change(p.button_type, () => this.render());
        this.on_change(p.labels, () => this.render());
        this.on_change(p.active, () => this._update_active());
    }
    styles() {
        return [...super.styles(), buttons_css];
    }
    render() {
        super.render();
        this._buttons = this.model.labels.map((label, i) => {
            const button_el = button({
                class: [buttons.btn, buttons[`btn_${this.model.button_type}`]],
                disabled: this.model.disabled,
            }, label);
            button_el.addEventListener("click", () => {
                this.change_active(i);
                this.model.trigger_event(new ButtonClick());
            });
            return button_el;
        });
        this._update_active();
        const orient = this.model.orientation == "horizontal" ? buttons.horizontal : buttons.vertical;
        const group = div({ class: [buttons.btn_group, orient] }, this._buttons);
        this.shadow_el.appendChild(group);
    }
}
ToggleButtonGroupView.__name__ = "ToggleButtonGroupView";
export class ToggleButtonGroup extends OrientedControl {
    constructor(attrs) {
        super(attrs);
    }
}
_a = ToggleButtonGroup;
ToggleButtonGroup.__name__ = "ToggleButtonGroup";
(() => {
    _a.define(({ String, Array }) => ({
        labels: [Array(String), []],
        button_type: [ButtonType, "default"],
    }));
})();
//# sourceMappingURL=toggle_button_group.js.map