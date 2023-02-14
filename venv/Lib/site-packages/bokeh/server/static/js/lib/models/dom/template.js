var _a;
import { DOMElement, DOMElementView } from "./dom_element";
import { Action } from "./action";
import { PlaceholderView } from "./placeholder";
import { build_views, remove_views } from "../../core/build_views";
export class TemplateView extends DOMElementView {
    constructor() {
        super(...arguments);
        this.action_views = new Map();
    }
    *children() {
        yield* super.children();
        yield* this.action_views.values();
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        await build_views(this.action_views, this.model.actions, { parent: this });
    }
    remove() {
        remove_views(this.action_views);
        super.remove();
    }
    update(source, i, vars = {} /*, formatters?: Formatters*/) {
        function descend(obj) {
            for (const child of obj.child_views.values()) {
                if (child instanceof PlaceholderView) {
                    child.update(source, i, vars);
                }
                else if (child instanceof DOMElementView) {
                    descend(child);
                }
            }
        }
        descend(this);
        for (const action of this.action_views.values()) {
            action.update(source, i, vars);
        }
    }
}
TemplateView.__name__ = "TemplateView";
TemplateView.tag_name = "div";
export class Template extends DOMElement {
}
_a = Template;
Template.__name__ = "Template";
(() => {
    _a.prototype.default_view = TemplateView;
    _a.define(({ Array, Ref }) => ({
        actions: [Array(Ref(Action)), []],
    }));
})();
//# sourceMappingURL=template.js.map