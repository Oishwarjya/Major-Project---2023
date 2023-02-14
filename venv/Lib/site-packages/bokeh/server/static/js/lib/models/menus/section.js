var _a;
import { MenuItem, MenuItemView } from "./menu_item";
export class SectionView extends MenuItemView {
    render() {
        super.render();
    }
}
SectionView.__name__ = "SectionView";
export class Section extends MenuItem {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Section;
Section.__name__ = "Section";
(() => {
    _a.prototype.default_view = SectionView;
    _a.define(({ Array, Ref }) => ({
        items: [Array(Ref(MenuItem)), []],
    }));
})();
//# sourceMappingURL=section.js.map