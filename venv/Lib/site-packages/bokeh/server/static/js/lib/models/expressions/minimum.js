var _a;
import { ScalarExpression } from "./expression";
import { dict } from "../../core/util/object";
import { min } from "../../core/util/array";
export class Minimum extends ScalarExpression {
    constructor(attrs) {
        super(attrs);
    }
    _compute(source) {
        const column = dict(source.data).get(this.field) ?? [];
        return Math.min(this.initial, min(column));
    }
}
_a = Minimum;
Minimum.__name__ = "Minimum";
(() => {
    _a.define(({ Number, String }) => ({
        field: [String],
        initial: [Number, Infinity],
    }));
})();
//# sourceMappingURL=minimum.js.map