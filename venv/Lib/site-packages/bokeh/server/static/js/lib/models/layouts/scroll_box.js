var _a;
import { LayoutDOM, LayoutDOMView } from "./layout_dom";
import { UIElement } from "../ui/ui_element";
import { ScrollbarPolicy } from "../../core/enums";
export class ScrollBoxView extends LayoutDOMView {
    styles() {
        return [...super.styles()];
    }
    connect_signals() {
        super.connect_signals();
        const { child, horizontal_scrollbar, vertical_scrollbar } = this.model.properties;
        this.on_change(child, () => this.update_children());
        this.on_change([horizontal_scrollbar, vertical_scrollbar], () => this.invalidate_layout());
    }
    get child_models() {
        return [this.model.child];
    }
    _update_layout() {
        super._update_layout();
        function to_overflow(policy) {
            switch (policy) {
                case "auto": return "auto";
                case "visible": return "scroll";
                case "hidden": return "hidden";
            }
        }
        const { horizontal_scrollbar, vertical_scrollbar } = this.model;
        this.style.append(":host", {
            overflow_x: to_overflow(horizontal_scrollbar),
            overflow_y: to_overflow(vertical_scrollbar),
        });
    }
}
ScrollBoxView.__name__ = "ScrollBoxView";
export class ScrollBox extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
}
_a = ScrollBox;
ScrollBox.__name__ = "ScrollBox";
(() => {
    _a.prototype.default_view = ScrollBoxView;
    _a.define(({ Ref }) => ({
        child: [Ref(UIElement)],
        horizontal_scrollbar: [ScrollbarPolicy, "auto"],
        vertical_scrollbar: [ScrollbarPolicy, "auto"],
    }));
})();
//# sourceMappingURL=scroll_box.js.map