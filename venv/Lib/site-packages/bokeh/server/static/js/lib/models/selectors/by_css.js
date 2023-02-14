import { Selector } from "./selector";
export class ByCSS extends Selector {
    constructor(attrs) {
        super(attrs);
    }
    find_one(target) {
        return target.querySelector(this.query);
    }
}
ByCSS.__name__ = "ByCSS";
//# sourceMappingURL=by_css.js.map