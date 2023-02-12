var _a;
import { Action, ActionView } from "./action";
export class CheckActionView extends ActionView {
}
CheckActionView.__name__ = "CheckActionView";
export class CheckAction extends Action {
    constructor(attrs) {
        super(attrs);
    }
}
_a = CheckAction;
CheckAction.__name__ = "CheckAction";
(() => {
    _a.prototype.default_view = CheckActionView;
    _a.define(({ Boolean }) => ({
        checked: [Boolean, false],
    }));
})();
//# sourceMappingURL=check_action.js.map