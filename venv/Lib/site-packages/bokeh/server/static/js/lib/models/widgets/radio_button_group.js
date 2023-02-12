var _a;
import { ToggleButtonGroup, ToggleButtonGroupView } from "./toggle_button_group";
import * as buttons from "../../styles/buttons.css";
export class RadioButtonGroupView extends ToggleButtonGroupView {
    change_active(i) {
        if (this.model.active !== i) {
            this.model.active = i;
        }
    }
    _update_active() {
        const { active } = this.model;
        this._buttons.forEach((button_el, i) => {
            button_el.classList.toggle(buttons.active, active === i);
        });
    }
}
RadioButtonGroupView.__name__ = "RadioButtonGroupView";
export class RadioButtonGroup extends ToggleButtonGroup {
    constructor(attrs) {
        super(attrs);
    }
}
_a = RadioButtonGroup;
RadioButtonGroup.__name__ = "RadioButtonGroup";
(() => {
    _a.prototype.default_view = RadioButtonGroupView;
    _a.define(({ Int, Nullable }) => ({
        active: [Nullable(Int), null],
    }));
})();
//# sourceMappingURL=radio_button_group.js.map