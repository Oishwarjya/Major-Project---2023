var _a;
import { TextInput, TextInputView } from "./text_input";
import { empty, display, undisplay, div } from "../../core/dom";
import { take } from "../../core/util/iterator";
import { clamp } from "../../core/util/math";
import dropdown_css, * as dropdown from "../../styles/dropdown.css";
export class AutocompleteInputView extends TextInputView {
    constructor() {
        super(...arguments);
        this._open = false;
        this._last_value = "";
        this._hover_index = 0;
    }
    styles() {
        return [...super.styles(), dropdown_css];
    }
    render() {
        super.render();
        this.input_el.addEventListener("keydown", (event) => this._keydown(event));
        this.input_el.addEventListener("keyup", (event) => this._keyup(event));
        this.input_el.addEventListener("focusin", () => this._toggle_menu());
        this.menu = div({ class: [dropdown.menu, dropdown.below] });
        this.menu.addEventListener("click", (event) => this._menu_click(event));
        this.menu.addEventListener("mouseover", (event) => this._menu_hover(event));
        this.shadow_el.appendChild(this.menu);
        undisplay(this.menu);
    }
    change_input() {
        if (this._open && this.menu.children.length > 0) {
            this.model.value = this.menu.children[this._hover_index].textContent;
            this.input_el.focus();
            this._hide_menu();
        }
        else if (!this.model.restrict) {
            super.change_input();
        }
    }
    _update_completions(completions) {
        empty(this.menu);
        const { max_completions } = this.model;
        const selected_completions = max_completions != null ? take(completions, max_completions) : completions;
        for (const text of selected_completions) {
            const item = div(text);
            this.menu.append(item);
        }
        this.menu.firstElementChild?.classList.add(dropdown.active);
    }
    _toggle_menu() {
        const { value } = this.input_el;
        if (value.length < this.model.min_characters) {
            this._hide_menu();
            return;
        }
        const acnorm = (() => {
            const { case_sensitive } = this.model;
            return case_sensitive ? (t) => t : (t) => t.toLowerCase();
        })();
        const completions = [];
        for (const text of this.model.completions) {
            if (acnorm(text).startsWith(acnorm(value))) {
                completions.push(text);
            }
        }
        this._update_completions(completions);
        if (completions.length == 0)
            this._hide_menu();
        else
            this._show_menu();
    }
    _show_menu() {
        if (!this._open) {
            this._open = true;
            this._hover_index = 0;
            this._last_value = this.model.value;
            display(this.menu);
            const listener = (event) => {
                if (!event.composedPath().includes(this.el)) {
                    document.removeEventListener("click", listener);
                    this._hide_menu();
                }
            };
            document.addEventListener("click", listener);
        }
    }
    _hide_menu() {
        if (this._open) {
            this._open = false;
            undisplay(this.menu);
        }
    }
    _menu_click(event) {
        if (event.target != event.currentTarget && event.target instanceof Element) {
            this.model.value = event.target.textContent;
            this.input_el.focus();
            this._hide_menu();
        }
    }
    _menu_hover(event) {
        if (event.target != event.currentTarget && event.target instanceof Element) {
            for (let i = 0; i < this.menu.children.length; i++) {
                if (this.menu.children[i].textContent == event.target.textContent) {
                    this._bump_hover(i);
                    break;
                }
            }
        }
    }
    _bump_hover(new_index) {
        const n_children = this.menu.children.length;
        if (this._open && n_children > 0) {
            this.menu.children[this._hover_index].classList.remove(dropdown.active);
            this._hover_index = clamp(new_index, 0, n_children - 1);
            this.menu.children[this._hover_index].classList.add(dropdown.active);
        }
    }
    _keydown(_event) { }
    _keyup(event) {
        switch (event.key) {
            case "Enter": {
                this.change_input();
                break;
            }
            case "Escape": {
                this._hide_menu();
                break;
            }
            case "ArrowUp": {
                this._bump_hover(this._hover_index - 1);
                break;
            }
            case "ArrowDown": {
                this._bump_hover(this._hover_index + 1);
                break;
            }
            default:
                this._toggle_menu();
        }
    }
}
AutocompleteInputView.__name__ = "AutocompleteInputView";
export class AutocompleteInput extends TextInput {
    constructor(attrs) {
        super(attrs);
    }
}
_a = AutocompleteInput;
AutocompleteInput.__name__ = "AutocompleteInput";
(() => {
    _a.prototype.default_view = AutocompleteInputView;
    _a.define(({ Boolean, Int, String, Array, NonNegative, Positive, Nullable }) => ({
        completions: [Array(String), []],
        min_characters: [NonNegative(Int), 2],
        max_completions: [Nullable(Positive(Int)), null],
        case_sensitive: [Boolean, true],
        restrict: [Boolean, true],
    }));
})();
//# sourceMappingURL=autocomplete_input.js.map