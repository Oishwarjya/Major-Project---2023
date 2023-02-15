var _a;
import { Expression } from "./expression";
import { dict } from "../../core/util/object";
export class Stack extends Expression {
    constructor(attrs) {
        super(attrs);
    }
    _v_compute(source) {
        const n = source.get_length() ?? 0;
        const result = new Float64Array(n);
        for (const f of this.fields) {
            const column = dict(source.data).get(f);
            if (column != null) {
                const k = Math.min(n, column.length);
                for (let i = 0; i < k; i++) {
                    result[i] += column[i];
                }
            }
        }
        return result;
    }
}
_a = Stack;
Stack.__name__ = "Stack";
(() => {
    _a.define(({ String, Array }) => ({
        fields: [Array(String), []],
    }));
})();
//# sourceMappingURL=stack.js.map