var _a;
import { DOMNode, DOMNodeView } from "./dom_node";
export class TextView extends DOMNodeView {
    render() {
        this.el.textContent = this.model.content;
    }
    _createElement() {
        return document.createTextNode("");
    }
}
TextView.__name__ = "TextView";
export class Text extends DOMNode {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Text;
Text.__name__ = "Text";
(() => {
    _a.prototype.default_view = TextView;
    _a.define(({ String }) => ({
        content: [String, ""],
    }));
})();
//# sourceMappingURL=text.js.map