var _a;
import { DOMNode, DOMNodeView } from "./dom_node";
import { UIElement } from "../ui/ui_element";
import { build_views, remove_views } from "../../core/build_views";
import { empty } from "../../core/dom";
import { assert } from "../../core/util/assert";
import { isString } from "../../core/util/types";
export class HTMLView extends DOMNodeView {
    constructor() {
        super(...arguments);
        this._refs = new Map();
    }
    *children() {
        yield* super.children();
        yield* this._refs.values();
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        await build_views(this._refs, this.model.refs);
    }
    remove() {
        remove_views(this._refs);
        super.remove();
    }
    render() {
        empty(this.el);
        this.el.style.display = "contents";
        const parser = new DOMParser();
        const nodes = (() => {
            const { html } = this.model;
            if (isString(html)) {
                const document = parser.parseFromString(html, "text/html");
                const iter = document.createNodeIterator(document, NodeFilter.SHOW_ELEMENT, (node) => {
                    return node.nodeName.toLowerCase() == "ref" ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                });
                let node;
                while (node = iter.nextNode()) {
                    assert(node instanceof Element);
                    const id = node.getAttribute("id");
                    if (id != null) {
                        for (const [model, view] of this._refs) {
                            if (model.id == id) {
                                view.render();
                                node.replaceWith(view.el);
                                break;
                            }
                        }
                    }
                }
                return [...document.body.childNodes];
            }
            else {
                return []; // TODO
            }
        })();
        for (const node of nodes) {
            this.el.appendChild(node);
        }
    }
}
HTMLView.__name__ = "HTMLView";
export class HTML extends DOMNode {
    constructor(attrs) {
        super(attrs);
    }
}
_a = HTML;
HTML.__name__ = "HTML";
(() => {
    _a.prototype.default_view = HTMLView;
    _a.define(({ String, Array, Or, Ref }) => ({
        html: [Or(String, Array(Or(String, Ref(DOMNode), Ref(UIElement))))],
        refs: [Array(Or(Ref(DOMNode), Ref(UIElement))), []],
    }));
})();
//# sourceMappingURL=html.js.map