var _a;
import { CSSGridBox, CSSGridBoxView, TracksSizing } from "./css_grid_box";
import { UIElement } from "../ui/ui_element";
export class GridBoxView extends CSSGridBoxView {
    connect_signals() {
        super.connect_signals();
        const { children, rows, cols } = this.model.properties;
        this.on_change(children, () => this.update_children());
        this.on_change([rows, cols], () => this.invalidate_layout());
    }
    get _children() {
        return this.model.children;
    }
    get _rows() {
        return this.model.rows;
    }
    get _cols() {
        return this.model.cols;
    }
}
GridBoxView.__name__ = "GridBoxView";
export class GridBox extends CSSGridBox {
    constructor(attrs) {
        super(attrs);
    }
}
_a = GridBox;
GridBox.__name__ = "GridBox";
(() => {
    _a.prototype.default_view = GridBoxView;
    _a.define(({ Int, Tuple, Array, Ref, Opt, Nullable }) => {
        return {
            children: [Array(Tuple(Ref(UIElement), Int, Int, Opt(Int), Opt(Int))), []],
            rows: [Nullable(TracksSizing), null],
            cols: [Nullable(TracksSizing), null],
        };
    });
})();
//# sourceMappingURL=grid_box.js.map