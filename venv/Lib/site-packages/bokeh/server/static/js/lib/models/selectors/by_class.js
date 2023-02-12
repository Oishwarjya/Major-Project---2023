import { Selector } from "./selector";
export class ByClass extends Selector {
    constructor(attrs) {
        super(attrs);
    }
    find_one(target) {
        return target.querySelector(`.${this.query}`);
    }
}
ByClass.__name__ = "ByClass";
//# sourceMappingURL=by_class.js.map