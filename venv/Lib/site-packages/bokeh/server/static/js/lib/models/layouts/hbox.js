var _a;
import { CSSGridBox, CSSGridBoxView, TracksSizing } from "./css_grid_box";
import { UIElement } from "../ui/ui_element";
export class HBoxView extends CSSGridBoxView {
    connect_signals() {
        super.connect_signals();
        const { children, cols } = this.model.properties;
        this.on_change(children, () => this.update_children());
        this.on_change(cols, () => this.invalidate_layout());
    }
    get _children() {
        return this.model.children.map(({ child, col, span }, i) => [child, 0, col ?? i, 1, span ?? 1]);
    }
    get _rows() {
        return null;
    }
    get _cols() {
        return this.model.cols;
    }
}
HBoxView.__name__ = "HBoxView";
export class HBox extends CSSGridBox {
    constructor(attrs) {
        super(attrs);
    }
}
_a = HBox;
HBox.__name__ = "HBox";
(() => {
    _a.prototype.default_view = HBoxView;
    _a.define(({ Int, Struct, Array, Ref, Opt, Nullable }) => ({
        children: [Array(Struct({ child: Ref(UIElement), col: Opt(Int), span: Opt(Int) })), []],
        cols: [Nullable(TracksSizing), null],
    }));
})();
//# sourceMappingURL=hbox.js.map