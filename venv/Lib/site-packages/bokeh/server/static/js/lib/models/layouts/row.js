var _a;
import { FlexBox, FlexBoxView } from "./flex_box";
export class RowView extends FlexBoxView {
    constructor() {
        super(...arguments);
        this._direction = "row";
    }
}
RowView.__name__ = "RowView";
export class Row extends FlexBox {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Row;
Row.__name__ = "Row";
(() => {
    _a.prototype.default_view = RowView;
})();
//# sourceMappingURL=row.js.map