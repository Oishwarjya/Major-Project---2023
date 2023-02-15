var _a;
import { Widget, WidgetView } from "./widget";
export class ToggleInputView extends WidgetView {
    connect_signals() {
        super.connect_signals();
        const { active, disabled } = this.model.properties;
        this.on_change(active, () => this._update_active());
        this.on_change(disabled, () => this._update_disabled());
    }
    _toggle_active() {
        if (!this.model.disabled) {
            this.model.active = !this.model.active;
        }
    }
}
ToggleInputView.__name__ = "ToggleInputView";
export class ToggleInput extends Widget {
    constructor(attrs) {
        super(attrs);
    }
}
_a = ToggleInput;
ToggleInput.__name__ = "ToggleInput";
(() => {
    _a.define(({ Boolean }) => ({
        active: [Boolean, false],
    }));
})();
//# sourceMappingURL=toggle_input.js.map