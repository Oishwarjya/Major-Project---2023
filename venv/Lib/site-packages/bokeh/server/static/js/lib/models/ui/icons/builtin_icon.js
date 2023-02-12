var _a;
import { Icon, IconView } from "./icon";
import { StyleSheet } from "../../../core/dom";
import { color2css } from "../../../core/util/color";
import { isNumber } from "../../../core/util/types";
import icons_css from "../../../styles/icons.css";
export class BuiltinIconView extends IconView {
    constructor() {
        super(...arguments);
        this._style = new StyleSheet();
    }
    styles() {
        return [...super.styles(), icons_css, this._style];
    }
    render() {
        super.render();
        const icon = `var(--bokeh-icon-${this.model.icon_name})`;
        const color = color2css(this.model.color);
        const size = (() => {
            const { size } = this.model;
            return isNumber(size) ? `${size}px` : size;
        })();
        this._style.replace(`
      :host {
        display: inline-block;
        vertical-align: middle;
        width: ${size};
        height: ${size};
        background-color: ${color};
        mask-image: ${icon};
        mask-size: contain;
        mask-repeat: no-repeat;
        -webkit-mask-image: ${icon};
        -webkit-mask-size: contain;
        -webkit-mask-repeat: no-repeat;
      }
    `);
    }
}
BuiltinIconView.__name__ = "BuiltinIconView";
export class BuiltinIcon extends Icon {
    constructor(attrs) {
        super(attrs);
    }
}
_a = BuiltinIcon;
BuiltinIcon.__name__ = "BuiltinIcon";
(() => {
    _a.prototype.default_view = BuiltinIconView;
    _a.define(({ String, Color }) => ({
        icon_name: [String],
        color: [Color, "gray"],
    }));
})();
//# sourceMappingURL=builtin_icon.js.map