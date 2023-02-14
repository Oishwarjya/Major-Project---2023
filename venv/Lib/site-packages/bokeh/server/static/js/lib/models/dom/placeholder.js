import { DOMNode, DOMNodeView } from "./dom_node";
export class PlaceholderView extends DOMNodeView {
    render() {
        // XXX: no implementation?
    }
}
PlaceholderView.__name__ = "PlaceholderView";
PlaceholderView.tag_name = "span";
export class Placeholder extends DOMNode {
    constructor(attrs) {
        super(attrs);
    }
}
Placeholder.__name__ = "Placeholder";
//# sourceMappingURL=placeholder.js.map