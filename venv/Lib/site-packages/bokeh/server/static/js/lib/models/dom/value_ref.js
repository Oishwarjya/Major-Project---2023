var _a;
import { Placeholder, PlaceholderView } from "./placeholder";
import { _get_column_value } from "../../core/util/templating";
export class ValueRefView extends PlaceholderView {
    update(source, i, _vars /*, formatters?: Formatters*/) {
        const value = _get_column_value(this.model.field, source, i);
        const text = value == null ? "???" : `${value}`; //.toString()
        this.el.textContent = text;
    }
}
ValueRefView.__name__ = "ValueRefView";
export class ValueRef extends Placeholder {
    constructor(attrs) {
        super(attrs);
    }
}
_a = ValueRef;
ValueRef.__name__ = "ValueRef";
(() => {
    _a.prototype.default_view = ValueRefView;
    _a.define(({ String }) => ({
        field: [String],
    }));
})();
//# sourceMappingURL=value_ref.js.map