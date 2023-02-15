var _a;
import { DOMNode, DOMNodeView } from "./dom_node";
import { Styles } from "./styles";
import { UIElement } from "../ui/ui_element";
import { build_views, remove_views } from "../../core/build_views";
import { entries } from "../../core/util/object";
import { isString } from "../../core/util/types";
export class DOMElementView extends DOMNodeView {
    constructor() {
        super(...arguments);
        this.child_views = new Map();
    }
    *children() {
        yield* super.children();
        yield* this.child_views.values();
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const children = this.model.children.filter((obj) => !isString(obj));
        await build_views(this.child_views, children, { parent: this });
    }
    remove() {
        remove_views(this.child_views);
        super.remove();
    }
    render() {
        const { style } = this.model;
        if (style != null) {
            /*
            type IsString<T> = T extends string ? T : never
            type Key = Exclude<IsString<keyof CSSStyleDeclaration>,
              "length" | "parentRule" | "getPropertyPriority" | "getPropertyValue" | "item" | "removeProperty" | "setProperty">
            //this.el.style[key as Key] = value
            */
            if (style instanceof Styles) {
                for (const prop of style) {
                    const value = prop.get_value();
                    if (isString(value)) {
                        const name = prop.attr.replace(/_/g, "-");
                        if (this.el.style.hasOwnProperty(name)) {
                            this.el.style.setProperty(name, value);
                        }
                    }
                }
            }
            else {
                for (const [key, value] of entries(style)) {
                    const name = key.replace(/_/g, "-");
                    if (this.el.style.hasOwnProperty(name)) {
                        this.el.style.setProperty(name, value);
                    }
                }
            }
        }
        for (const child of this.model.children) {
            if (isString(child)) {
                const node = document.createTextNode(child);
                this.el.appendChild(node);
            }
            else {
                const child_view = this.child_views.get(child);
                child_view.render_to(this.el);
            }
        }
        this.finish();
    }
}
DOMElementView.__name__ = "DOMElementView";
export class DOMElement extends DOMNode {
    constructor(attrs) {
        super(attrs);
    }
}
_a = DOMElement;
DOMElement.__name__ = "DOMElement";
(() => {
    _a.define(({ String, Array, Dict, Or, Nullable, Ref }) => ({
        style: [Nullable(Or(Ref(Styles), Dict(String))), null],
        children: [Array(Or(String, Ref(DOMNode), Ref(UIElement))), []],
    }));
})();
//# sourceMappingURL=dom_element.js.map