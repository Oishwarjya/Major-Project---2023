var _a;
import { Model } from "../../model";
import { UIElement } from "../ui/ui_element";
export class TabPanel extends Model {
    constructor(attrs) {
        super(attrs);
    }
}
_a = TabPanel;
TabPanel.__name__ = "TabPanel";
(() => {
    _a.define(({ Boolean, String, Ref }) => ({
        title: [String, ""],
        child: [Ref(UIElement)],
        closable: [Boolean, false],
        disabled: [Boolean, false],
    }));
})();
//# sourceMappingURL=tab_panel.js.map