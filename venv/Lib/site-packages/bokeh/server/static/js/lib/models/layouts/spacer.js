var _a;
import { LayoutDOM, LayoutDOMView } from "./layout_dom";
export class SpacerView extends LayoutDOMView {
    constructor() {
        super(...arguments);
        this._auto_width = "auto";
        this._auto_height = "auto";
    }
    get child_models() {
        return [];
    }
}
SpacerView.__name__ = "SpacerView";
export class Spacer extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Spacer;
Spacer.__name__ = "Spacer";
(() => {
    _a.prototype.default_view = SpacerView;
})();
//# sourceMappingURL=spacer.js.map