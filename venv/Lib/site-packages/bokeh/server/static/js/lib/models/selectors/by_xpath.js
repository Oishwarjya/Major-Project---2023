import { Selector } from "./selector";
export class ByXPath extends Selector {
    constructor(attrs) {
        super(attrs);
    }
    find_one(target) {
        return document.evaluate(this.query, target).iterateNext();
    }
}
ByXPath.__name__ = "ByXPath";
//# sourceMappingURL=by_xpath.js.map