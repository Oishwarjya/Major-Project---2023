var _a;
import { LayoutDOM, LayoutDOMView } from "./layout_dom";
import { UIElement } from "../ui/ui_element";
import { fieldset, legend, input, display } from "../../core/dom";
import group_box_css from "../../styles/group_box.css";
export class GroupBoxView extends LayoutDOMView {
    styles() {
        return [...super.styles(), group_box_css];
    }
    connect_signals() {
        super.connect_signals();
        const { child } = this.model.properties;
        this.on_change(child, () => this.update_children());
        const { checkable, disabled } = this.model.properties;
        this.on_change(checkable, () => {
            display(this.checkbox_el, this.model.checkable);
        });
        this.on_change(disabled, () => {
            this.checkbox_el.checked = !this.model.disabled;
        });
    }
    get child_models() {
        return [this.model.child];
    }
    render() {
        super.render();
        const { checkable, disabled, title } = this.model;
        this.checkbox_el = input({ type: "checkbox", checked: !disabled });
        this.checkbox_el.addEventListener("change", () => {
            this.model.disabled = !this.checkbox_el.checked;
        });
        display(this.checkbox_el, checkable);
        const title_el = legend({}, this.checkbox_el, title);
        const child_els = this.child_views.map((child) => child.el);
        this.fieldset_el = fieldset({}, title_el, ...child_els);
        this.shadow_el.appendChild(this.fieldset_el);
    }
    _update_children() {
        const child_els = this.child_views.map((child) => child.el);
        this.fieldset_el.append(...child_els);
    }
}
GroupBoxView.__name__ = "GroupBoxView";
export class GroupBox extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
}
_a = GroupBox;
GroupBox.__name__ = "GroupBox";
(() => {
    _a.prototype.default_view = GroupBoxView;
    _a.define(({ Boolean, String, Nullable, Ref }) => ({
        title: [Nullable(String), null],
        child: [Ref(UIElement)],
        checkable: [Boolean, false],
    }));
})();
//# sourceMappingURL=group_box.js.map