var _a;
import { ToggleButtonGroup, ToggleButtonGroupView } from "./toggle_button_group";
import * as buttons from "../../styles/buttons.css";
export class CheckboxButtonGroupView extends ToggleButtonGroupView {
    get active() {
        return new Set(this.model.active);
    }
    change_active(i) {
        const { active } = this;
        active.has(i) ? active.delete(i) : active.add(i);
        this.model.active = [...active].sort();
    }
    _update_active() {
        const { active } = this;
        this._buttons.forEach((button_el, i) => {
            button_el.classList.toggle(buttons.active, active.has(i));
        });
    }
}
CheckboxButtonGroupView.__name__ = "CheckboxButtonGroupView";
export class CheckboxButtonGroup extends ToggleButtonGroup {
    constructor(attrs) {
        super(attrs);
    }
}
_a = CheckboxButtonGroup;
CheckboxButtonGroup.__name__ = "CheckboxButtonGroup";
(() => {
    _a.prototype.default_view = CheckboxButtonGroupView;
    _a.define(({ Int, Array }) => ({
        active: [Array(Int), []],
    }));
})();
//# sourceMappingURL=checkbox_button_group.js.map