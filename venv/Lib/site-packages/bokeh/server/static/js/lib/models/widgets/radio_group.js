var _a;
import { ToggleInputGroup, ToggleInputGroupView } from "./toggle_input_group";
import { input, label, div, span } from "../../core/dom";
import { unique_id } from "../../core/util/string";
import { enumerate } from "../../core/util/iterator";
import * as inputs from "../../styles/widgets/inputs.css";
export class RadioGroupView extends ToggleInputGroupView {
    connect_signals() {
        super.connect_signals();
        const { active } = this.model.properties;
        this.on_change(active, () => {
            const { active } = this.model;
            for (const [input_el, i] of enumerate(this._inputs)) {
                input_el.checked = active == i;
            }
        });
    }
    render() {
        super.render();
        const group = div({ class: [inputs.input_group, this.model.inline ? inputs.inline : null] });
        this.shadow_el.appendChild(group);
        const name = unique_id();
        const { active, labels } = this.model;
        this._inputs = [];
        for (let i = 0; i < labels.length; i++) {
            const radio = input({ type: "radio", name, value: `${i}` });
            radio.addEventListener("change", () => this.change_active(i));
            this._inputs.push(radio);
            if (this.model.disabled)
                radio.disabled = true;
            if (i == active)
                radio.checked = true;
            const label_el = label(radio, span(labels[i]));
            group.appendChild(label_el);
        }
    }
    change_active(i) {
        this.model.active = i;
    }
}
RadioGroupView.__name__ = "RadioGroupView";
export class RadioGroup extends ToggleInputGroup {
    constructor(attrs) {
        super(attrs);
    }
}
_a = RadioGroup;
RadioGroup.__name__ = "RadioGroup";
(() => {
    _a.prototype.default_view = RadioGroupView;
    _a.define(({ Int, Nullable }) => ({
        active: [Nullable(Int), null],
    }));
})();
//# sourceMappingURL=radio_group.js.map