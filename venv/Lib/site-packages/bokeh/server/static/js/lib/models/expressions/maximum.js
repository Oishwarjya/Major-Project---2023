var _a;
import { ScalarExpression } from "./expression";
import { dict } from "../../core/util/object";
import { max } from "../../core/util/array";
export class Maximum extends ScalarExpression {
    constructor(attrs) {
        super(attrs);
    }
    _compute(source) {
        const column = dict(source.data).get(this.field) ?? [];
        return Math.max(this.initial, max(column));
    }
}
_a = Maximum;
Maximum.__name__ = "Maximum";
(() => {
    _a.define(({ Number, String }) => ({
        field: [String],
        initial: [Number, -Infinity],
    }));
})();
//# sourceMappingURL=maximum.js.map