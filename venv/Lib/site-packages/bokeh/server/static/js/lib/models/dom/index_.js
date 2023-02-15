var _a;
import { Placeholder, PlaceholderView } from "./placeholder";
export class IndexView extends PlaceholderView {
    update(_source, i, _vars /*, formatters?: Formatters*/) {
        this.el.textContent = i == null ? "(null)" : i.toString();
    }
}
IndexView.__name__ = "IndexView";
export class Index extends Placeholder {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Index;
Index.__name__ = "Index";
(() => {
    _a.prototype.default_view = IndexView;
})();
//# sourceMappingURL=index_.js.map