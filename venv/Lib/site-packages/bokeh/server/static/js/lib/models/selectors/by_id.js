import { Selector } from "./selector";
export class ByID extends Selector {
    constructor(attrs) {
        super(attrs);
    }
    find_one(target) {
        return target.querySelector(`#${this.query}`);
    }
}
ByID.__name__ = "ByID";
//# sourceMappingURL=by_id.js.map