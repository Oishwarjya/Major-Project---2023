var _a;
import { MenuItem, MenuItemView } from "./menu_item";
import * as menus from "../../styles/menus.css";
export class DividerView extends MenuItemView {
    render() {
        super.render();
        this.el.classList.add(menus.divider);
    }
}
DividerView.__name__ = "DividerView";
export class Divider extends MenuItem {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Divider;
Divider.__name__ = "Divider";
(() => {
    _a.prototype.default_view = DividerView;
})();
//# sourceMappingURL=divider.js.map