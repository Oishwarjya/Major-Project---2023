var _a;
import { ValueRef, ValueRefView } from "./value_ref";
import { _get_column_value } from "../../core/util/templating";
import { span } from "../../core/dom";
import * as styles from "../../styles/tooltips.css";
export class ColorRefView extends ValueRefView {
    render() {
        super.render();
        this.value_el = span();
        this.swatch_el = span({ class: styles.tooltip_color_block }, " ");
        this.el.appendChild(this.value_el);
        this.el.appendChild(this.swatch_el);
    }
    update(source, i, _vars /*, formatters?: Formatters*/) {
        const value = _get_column_value(this.model.field, source, i);
        const text = value == null ? "???" : `${value}`; //.toString()
        this.el.textContent = text;
    }
}
ColorRefView.__name__ = "ColorRefView";
export class ColorRef extends ValueRef {
    constructor(attrs) {
        super(attrs);
    }
}
_a = ColorRef;
ColorRef.__name__ = "ColorRef";
(() => {
    _a.prototype.default_view = ColorRefView;
    _a.define(({ Boolean }) => ({
        hex: [Boolean, true],
        swatch: [Boolean, true],
    }));
})();
//# sourceMappingURL=color_ref.js.map