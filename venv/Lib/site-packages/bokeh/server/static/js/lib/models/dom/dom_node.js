import { DOMView } from "../../core/dom_view";
import { Model } from "../../model";
export class DOMNodeView extends DOMView {
}
DOMNodeView.__name__ = "DOMNodeView";
export class DOMNode extends Model {
    constructor(attrs) {
        super(attrs);
    }
}
DOMNode.__name__ = "DOMNode";
DOMNode.__module__ = "bokeh.models.dom";
//# sourceMappingURL=dom_node.js.map