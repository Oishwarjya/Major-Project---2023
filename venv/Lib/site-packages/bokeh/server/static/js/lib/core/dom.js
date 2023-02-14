import { isBoolean, isString, isArray, isPlainObject } from "./util/types";
import { entries } from "./util/object";
import { BBox } from "./util/bbox";
const _createElement = (tag) => {
    return (attrs = {}, ...children) => {
        const element = document.createElement(tag);
        if (!isPlainObject(attrs)) {
            children = [attrs, ...children];
            attrs = {};
        }
        for (let [attr, value] of entries(attrs)) {
            if (value == null || isBoolean(value) && !value)
                continue;
            if (attr === "class") {
                if (isString(value))
                    value = value.split(/\s+/);
                if (isArray(value)) {
                    for (const cls of value) {
                        if (cls != null)
                            element.classList.add(cls);
                    }
                    continue;
                }
            }
            if (attr === "style" && isPlainObject(value)) {
                for (const [prop, data] of entries(value)) {
                    element.style[prop] = data;
                }
                continue;
            }
            if (attr === "data" && isPlainObject(value)) {
                for (const [key, data] of entries(value)) {
                    element.dataset[key] = data; // XXX: attrs needs a better type
                }
                continue;
            }
            element.setAttribute(attr, value);
        }
        function append(child) {
            if (isString(child))
                element.appendChild(document.createTextNode(child));
            else if (child instanceof Node)
                element.appendChild(child);
            else if (child instanceof NodeList || child instanceof HTMLCollection) {
                for (const el of child) {
                    element.appendChild(el);
                }
            }
            else if (child != null && child !== false)
                throw new Error(`expected a DOM element, string, false or null, got ${JSON.stringify(child)}`);
        }
        for (const child of children) {
            if (isArray(child)) {
                for (const _child of child)
                    append(_child);
            }
            else
                append(child);
        }
        return element;
    };
};
export function createElement(tag, attrs, ...children) {
    return _createElement(tag)(attrs, ...children);
}
export const div = _createElement("div"), span = _createElement("span"), canvas = _createElement("canvas"), link = _createElement("link"), style = _createElement("style"), a = _createElement("a"), p = _createElement("p"), i = _createElement("i"), pre = _createElement("pre"), button = _createElement("button"), label = _createElement("label"), legend = _createElement("legend"), fieldset = _createElement("fieldset"), input = _createElement("input"), select = _createElement("select"), option = _createElement("option"), optgroup = _createElement("optgroup"), textarea = _createElement("textarea");
export function createSVGElement(tag, attrs = null, ...children) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [attr, value] of entries(attrs ?? {})) {
        if (value == null || value === false)
            continue;
        element.setAttribute(attr, value);
    }
    function append(child) {
        if (isString(child))
            element.appendChild(document.createTextNode(child));
        else if (child instanceof Node)
            element.appendChild(child);
        else if (child instanceof NodeList || child instanceof HTMLCollection) {
            for (const el of child) {
                element.appendChild(el);
            }
        }
        else if (child != null && child !== false)
            throw new Error(`expected a DOM element, string, false or null, got ${JSON.stringify(child)}`);
    }
    for (const child of children) {
        if (isArray(child)) {
            for (const _child of child)
                append(_child);
        }
        else
            append(child);
    }
    return element;
}
export function text(str) {
    return document.createTextNode(str);
}
export function nbsp() {
    return text("\u00a0");
}
export function append(element, ...children) {
    for (const child of children)
        element.appendChild(child);
}
export function remove(element) {
    const parent = element.parentNode;
    if (parent != null) {
        parent.removeChild(element);
    }
}
export function replaceWith(element, replacement) {
    const parent = element.parentNode;
    if (parent != null) {
        parent.replaceChild(replacement, element);
    }
}
export function prepend(element, ...nodes) {
    const first = element.firstChild;
    for (const node of nodes) {
        element.insertBefore(node, first);
    }
}
export function empty(node, attrs = false) {
    let child;
    while (child = node.firstChild) {
        node.removeChild(child);
    }
    if (attrs && node instanceof Element) {
        for (const attr of node.attributes) {
            node.removeAttributeNode(attr);
        }
    }
}
export function contains(element, child) {
    /**
     * Like Node.contains(), but traverses Shadow DOM boundaries.
     */
    let current = child;
    while (current.parentNode != null) {
        const parent = current.parentNode;
        if (parent == element) {
            return true;
        }
        else if (parent instanceof ShadowRoot) {
            current = parent.host;
        }
        else {
            current = parent;
        }
    }
    return false;
}
export function display(element, display = true) {
    element.style.display = display ? "" : "none";
}
export function undisplay(element) {
    element.style.display = "none";
}
export function show(element) {
    element.style.visibility = "";
}
export function hide(element) {
    element.style.visibility = "hidden";
}
export function offset_bbox(element) {
    const { top, left, width, height } = element.getBoundingClientRect();
    return new BBox({
        left: left + scrollX - document.documentElement.clientLeft,
        top: top + scrollY - document.documentElement.clientTop,
        width,
        height,
    });
}
export function parent(el, selector) {
    let node = el;
    while (node = node.parentElement) {
        if (node.matches(selector))
            return node;
    }
    return null;
}
function num(value) {
    return parseFloat(value) || 0;
}
export function extents(el) {
    const style = getComputedStyle(el);
    return {
        border: {
            top: num(style.borderTopWidth),
            bottom: num(style.borderBottomWidth),
            left: num(style.borderLeftWidth),
            right: num(style.borderRightWidth),
        },
        margin: {
            top: num(style.marginTop),
            bottom: num(style.marginBottom),
            left: num(style.marginLeft),
            right: num(style.marginRight),
        },
        padding: {
            top: num(style.paddingTop),
            bottom: num(style.paddingBottom),
            left: num(style.paddingLeft),
            right: num(style.paddingRight),
        },
    };
}
export function size(el) {
    const rect = el.getBoundingClientRect();
    return {
        width: Math.ceil(rect.width),
        height: Math.ceil(rect.height),
    };
}
export function scroll_size(el) {
    return {
        width: Math.ceil(el.scrollWidth),
        height: Math.ceil(el.scrollHeight),
    };
}
export function outer_size(el) {
    const { margin: { left, right, top, bottom } } = extents(el);
    const { width, height } = size(el);
    return {
        width: Math.ceil(width + left + right),
        height: Math.ceil(height + top + bottom),
    };
}
export function content_size(el) {
    const { left, top } = el.getBoundingClientRect();
    const { padding } = extents(el);
    let width = 0;
    let height = 0;
    for (const child of (el.shadowRoot ?? el).children) {
        const rect = child.getBoundingClientRect();
        width = Math.max(width, Math.ceil(rect.left - left - padding.left + rect.width));
        height = Math.max(height, Math.ceil(rect.top - top - padding.top + rect.height));
    }
    return { width, height };
}
export function bounding_box(el) {
    const { x, y, width, height } = el.getBoundingClientRect();
    return new BBox({ x, y, width, height });
}
export function position(el, box, margin) {
    const { style } = el;
    style.left = `${box.x}px`;
    style.top = `${box.y}px`;
    style.width = `${box.width}px`;
    style.height = `${box.height}px`;
    if (margin == null)
        style.margin = "";
    else {
        const { top, right, bottom, left } = margin;
        style.margin = `${top}px ${right}px ${bottom}px ${left}px`;
    }
}
export class ClassList {
    constructor(class_list) {
        this.class_list = class_list;
    }
    get values() {
        const values = [];
        for (let i = 0; i < this.class_list.length; i++) {
            const item = this.class_list.item(i);
            if (item != null)
                values.push(item);
        }
        return values;
    }
    has(cls) {
        return this.class_list.contains(cls);
    }
    add(...classes) {
        for (const cls of classes)
            this.class_list.add(cls);
        return this;
    }
    remove(...classes) {
        for (const cls of classes) {
            if (isArray(cls)) {
                cls.forEach((cls) => this.class_list.remove(cls));
            }
            else {
                this.class_list.remove(cls);
            }
        }
        return this;
    }
    clear() {
        for (const cls of this.values) {
            this.class_list.remove(cls);
        }
        return this;
    }
    toggle(cls, activate) {
        const add = activate != null ? activate : !this.has(cls);
        if (add)
            this.add(cls);
        else
            this.remove(cls);
        return this;
    }
}
ClassList.__name__ = "ClassList";
export function classes(el) {
    return new ClassList(el.classList);
}
export function toggle_attribute(el, attr, state) {
    if (state == null) {
        state = !el.hasAttribute(attr);
    }
    if (state)
        el.setAttribute(attr, "true");
    else
        el.removeAttribute(attr);
}
export var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["None"] = 0] = "None";
    MouseButton[MouseButton["Primary"] = 1] = "Primary";
    MouseButton[MouseButton["Secondary"] = 2] = "Secondary";
    MouseButton[MouseButton["Auxiliary"] = 4] = "Auxiliary";
    MouseButton[MouseButton["Left"] = 1] = "Left";
    MouseButton[MouseButton["Right"] = 2] = "Right";
    MouseButton[MouseButton["Middle"] = 4] = "Middle";
})(MouseButton || (MouseButton = {}));
export class StyleSheet {
    constructor(css) {
        this.el = style({ type: "text/css" }, css);
    }
    clear() {
        this.replace("");
    }
    *_to_rules(styles) {
        // TODO: prefixing
        for (const [attr, value] of entries(styles)) {
            if (value != null) {
                const name = attr.replace(/_/g, "-");
                yield `${name}: ${value};`;
            }
        }
    }
    _to_css(css, styles) {
        if (styles == null)
            return css;
        else
            return `${css}{${[...this._to_rules(styles)].join("")}}`;
    }
    replace(css, styles) {
        this.el.textContent = this._to_css(css, styles);
    }
    prepend(css, styles) {
        const text = this.el.textContent ?? "";
        this.el.textContent = `${this._to_css(css, styles)}\n${text}`;
    }
    append(css, styles) {
        const text = this.el.textContent ?? "";
        this.el.textContent = `${text}\n${this._to_css(css, styles)}`;
    }
    remove() {
        remove(this.el);
    }
}
StyleSheet.__name__ = "StyleSheet";
export class GlobalStyleSheet extends StyleSheet {
    initialize() {
        if (!this.el.isConnected) {
            document.head.appendChild(this.el);
        }
    }
}
GlobalStyleSheet.__name__ = "GlobalStyleSheet";
export class ImportedStyleSheet {
    constructor(url) {
        this.el = link({ rel: "stylesheet", href: url });
    }
    replace(url) {
        this.el.href = url;
    }
    remove() {
        remove(this.el);
    }
}
ImportedStyleSheet.__name__ = "ImportedStyleSheet";
export class GlobalImportedStyleSheet extends StyleSheet {
    initialize() {
        if (!this.el.isConnected) {
            document.head.appendChild(this.el);
        }
    }
}
GlobalImportedStyleSheet.__name__ = "GlobalImportedStyleSheet";
export async function dom_ready() {
    if (document.readyState == "loading") {
        return new Promise((resolve, _reject) => {
            document.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
        });
    }
}
export function px(value) {
    return `${value}px`;
}
export const supports_adopted_stylesheets = "adoptedStyleSheets" in ShadowRoot.prototype;
//# sourceMappingURL=dom.js.map