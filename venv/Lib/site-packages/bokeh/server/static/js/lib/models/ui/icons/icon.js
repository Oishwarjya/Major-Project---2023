var _a;
import { Model } from "../../../model";
import { DOMComponentView } from "../../../core/dom_view";
export class IconView extends DOMComponentView {
}
IconView.__name__ = "IconView";
export class Icon extends Model {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Icon;
Icon.__name__ = "Icon";
(() => {
    _a.define(({ Number, Or, CSSLength }) => ({
        size: [Or(Number, CSSLength), "1em"],
    }));
})();
//# sourceMappingURL=icon.js.map