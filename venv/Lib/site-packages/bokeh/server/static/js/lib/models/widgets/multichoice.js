var _a;
import Choices from "choices.js";
import { select } from "../../core/dom";
import { isString } from "../../core/util/types";
import * as inputs from "../../styles/widgets/inputs.css";
import choices_css from "../../styles/widgets/choices.css";
import { InputWidget, InputWidgetView } from "./input_widget";
function retarget(event) {
    Object.defineProperty(event, "target", {
        get: () => event.composedPath()[0] ?? null,
        configurable: true,
    });
    return event;
}
class OurChoices extends Choices {
    _onFocus(event) {
        super._onFocus(retarget(event));
    }
    _onBlur(event) {
        super._onBlur(retarget(event));
    }
    _onKeyUp(event) {
        super._onKeyUp(retarget(event));
    }
    _onKeyDown(event) {
        super._onKeyDown(retarget(event));
    }
    _onClick(event) {
        super._onClick(retarget(event));
    }
    _onTouchEnd(event) {
        super._onTouchEnd(retarget(event));
    }
    _onMouseDown(event) {
        super._onMouseDown(retarget(event));
    }
    _onMouseOver(event) {
        super._onMouseOver(retarget(event));
    }
}
OurChoices.__name__ = "OurChoices";
export class MultiChoiceView extends InputWidgetView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.disabled.change, () => this.set_disabled());
        const { value, max_items, option_limit, search_option_limit, delete_button, placeholder, options, name, title } = this.model.properties;
        this.on_change([value, max_items, option_limit, search_option_limit, delete_button, placeholder, options, name, title], () => this.render());
    }
    styles() {
        return [...super.styles(), choices_css];
    }
    render() {
        super.render();
        this.input_el = select({
            multiple: true,
            class: inputs.input,
            name: this.model.name,
            disabled: this.model.disabled,
        });
        this.group_el.appendChild(this.input_el);
        const selected = new Set(this.model.value);
        const choices = this.model.options.map((opt) => {
            let value, label;
            if (isString(opt))
                value = label = opt;
            else
                [value, label] = opt;
            return { value, label, selected: selected.has(value) };
        });
        const fill = this.model.solid ? "solid" : "light";
        const item = `choices__item ${fill}`;
        const button = `choices__button ${fill}`;
        const options = {
            choices,
            itemSelectText: "",
            duplicateItemsAllowed: false,
            shouldSort: false,
            removeItemButton: this.model.delete_button,
            classNames: { item, button },
            placeholderValue: this.model.placeholder ?? undefined,
            maxItemCount: this.model.max_items ?? undefined,
            renderChoiceLimit: this.model.option_limit ?? undefined,
            searchResultLimit: this.model.search_option_limit ?? undefined,
        };
        this.choice_el = new OurChoices(this.input_el, options);
        this.input_el.addEventListener("change", () => this.change_input());
    }
    set_disabled() {
        if (this.model.disabled)
            this.choice_el.disable();
        else
            this.choice_el.enable();
    }
    change_input() {
        const is_focused = this.shadow_el.querySelector("select:focus") != null;
        const values = [];
        for (const el of this.shadow_el.querySelectorAll("option")) {
            if (el.selected)
                values.push(el.value);
        }
        this.model.value = values;
        super.change_input();
        // Restore focus back to the <select> afterwards,
        // so that even if python on_change callback is invoked,
        // focus remains on <select> and one can seamlessly scroll
        // up/down.
        if (is_focused)
            this.input_el.focus();
    }
}
MultiChoiceView.__name__ = "MultiChoiceView";
export class MultiChoice extends InputWidget {
    constructor(attrs) {
        super(attrs);
    }
}
_a = MultiChoice;
MultiChoice.__name__ = "MultiChoice";
(() => {
    _a.prototype.default_view = MultiChoiceView;
    _a.define(({ Boolean, Int, String, Array, Tuple, Or, Nullable }) => ({
        value: [Array(String), []],
        options: [Array(Or(String, Tuple(String, String))), []],
        max_items: [Nullable(Int), null],
        delete_button: [Boolean, true],
        placeholder: [Nullable(String), null],
        option_limit: [Nullable(Int), null],
        search_option_limit: [Nullable(Int), null],
        solid: [Boolean, true],
    }));
})();
//# sourceMappingURL=multichoice.js.map