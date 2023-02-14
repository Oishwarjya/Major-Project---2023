var _a;
import { Icon, IconView } from "./icon";
import { StyleSheet } from "../../../core/dom";
import { isNumber } from "../../../core/util/types";
export class SVGIconView extends IconView {
    constructor() {
        super(...arguments);
        this._style = new StyleSheet();
    }
    styles() {
        return [...super.styles(), this._style];
    }
    render() {
        super.render();
        const size = (() => {
            const { size } = this.model;
            return isNumber(size) ? `${size}px` : size;
        })();
        this._style.replace(`
      :host {
        display: inline-block;
        vertical-align: middle;
      }
      :host svg {
        width: ${size};
        height: ${size};
      }
    `);
        const parser = new DOMParser();
        const doc = parser.parseFromString(this.model.svg, "image/svg+xml");
        this.shadow_el.append(doc.documentElement);
    }
}
SVGIconView.__name__ = "SVGIconView";
export class SVGIcon extends Icon {
    constructor(attrs) {
        super(attrs);
    }
}
_a = SVGIcon;
SVGIcon.__name__ = "SVGIcon";
(() => {
    _a.prototype.default_view = SVGIconView;
    _a.define(({ String }) => ({
        svg: [String],
    }));
})();
//# sourceMappingURL=svg_icon.js.map