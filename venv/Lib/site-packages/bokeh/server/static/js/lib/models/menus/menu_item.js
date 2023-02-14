import { UIElement, UIElementView } from "../ui/ui_element";
import menus_css from "../../styles/menus.css";
import icons_css from "../../styles/icons.css";
export class MenuItemView extends UIElementView {
    styles() {
        return [...super.styles(), menus_css, icons_css];
    }
}
MenuItemView.__name__ = "MenuItemView";
export class MenuItem extends UIElement {
    constructor(attrs) {
        super(attrs);
    }
}
MenuItem.__name__ = "MenuItem";
//# sourceMappingURL=menu_item.js.map