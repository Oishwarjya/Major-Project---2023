var _a, _b, _c, _d;
import { DOMElement, DOMElementView } from "./dom_element";
export class SpanView extends DOMElementView {
}
SpanView.__name__ = "SpanView";
SpanView.tag_name = "span";
export class Span extends DOMElement {
}
_a = Span;
Span.__name__ = "Span";
(() => {
    _a.prototype.default_view = SpanView;
})();
export class DivView extends DOMElementView {
}
DivView.__name__ = "DivView";
DivView.tag_name = "div";
export class Div extends DOMElement {
}
_b = Div;
Div.__name__ = "Div";
(() => {
    _b.prototype.default_view = DivView;
})();
export class TableView extends DOMElementView {
}
TableView.__name__ = "TableView";
TableView.tag_name = "table";
export class Table extends DOMElement {
}
_c = Table;
Table.__name__ = "Table";
(() => {
    _c.prototype.default_view = TableView;
})();
export class TableRowView extends DOMElementView {
}
TableRowView.__name__ = "TableRowView";
TableRowView.tag_name = "tr";
export class TableRow extends DOMElement {
}
_d = TableRow;
TableRow.__name__ = "TableRow";
(() => {
    _d.prototype.default_view = TableRowView;
})();
//# sourceMappingURL=elements.js.map