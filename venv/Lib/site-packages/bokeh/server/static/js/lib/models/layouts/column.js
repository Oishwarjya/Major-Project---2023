var _a;
import { FlexBox, FlexBoxView } from "./flex_box";
export class ColumnView extends FlexBoxView {
    constructor() {
        super(...arguments);
        this._direction = "column";
    }
}
ColumnView.__name__ = "ColumnView";
export class Column extends FlexBox {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Column;
Column.__name__ = "Column";
(() => {
    _a.prototype.default_view = ColumnView;
})();
//# sourceMappingURL=column.js.map