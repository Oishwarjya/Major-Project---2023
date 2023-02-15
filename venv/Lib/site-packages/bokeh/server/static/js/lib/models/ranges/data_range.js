var _a;
import { Range } from "./range";
export class DataRange extends Range {
    constructor(attrs) {
        super(attrs);
    }
}
_a = DataRange;
DataRange.__name__ = "DataRange";
(() => {
    _a.define(({ Array, AnyRef, Or, Auto }) => ({
        renderers: [Or(Array(AnyRef()), Auto), []],
    }));
})();
//# sourceMappingURL=data_range.js.map