var _a;
import { Filter } from "./filter";
export class InversionFilter extends Filter {
    constructor(attrs) {
        super(attrs);
    }
    compute_indices(source) {
        const index = this.operand.compute_indices(source);
        index.invert();
        return index;
    }
}
_a = InversionFilter;
InversionFilter.__name__ = "InversionFilter";
(() => {
    _a.define(({ Ref }) => ({
        operand: [Ref(Filter)],
    }));
})();
//# sourceMappingURL=inversion_filter.js.map