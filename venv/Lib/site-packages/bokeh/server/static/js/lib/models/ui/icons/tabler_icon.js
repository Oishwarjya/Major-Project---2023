var _a, _b;
import { Icon, IconView } from "./icon";
import { span, StyleSheet, ImportedStyleSheet, GlobalStyleSheet } from "../../../core/dom";
import { isNumber } from "../../../core/util/types";
export class TablerIconView extends IconView {
    constructor() {
        super(...arguments);
        this._tabler = new ImportedStyleSheet(`${TablerIconView._url}/tabler-icons.min.css`);
        this._style = new StyleSheet();
    }
    styles() {
        return [...super.styles(), this._tabler, this._style];
    }
    initialize() {
        super.initialize();
        TablerIconView._fonts.initialize();
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
        font-size: ${size};
      }
    `);
        const icon = span({ class: ["ti", `ti-${this.model.icon_name}`] });
        this.shadow_el.appendChild(icon);
    }
}
_a = TablerIconView;
TablerIconView.__name__ = "TablerIconView";
TablerIconView._url = "https://unpkg.com/@tabler/icons@latest/iconfont";
TablerIconView._fonts = new GlobalStyleSheet(`\
    /*!
    * Tabler Icons 1.68.0 by tabler - https://tabler.io
    * License - https://github.com/tabler/tabler-icons/blob/master/LICENSE
    */
  @font-face {
    font-family: "tabler-icons";
    font-style: normal;
    font-weight: 400;
    src: url("${_a._url}/fonts/tabler-icons.eot");
    src: url("${_a._url}/fonts/tabler-icons.eot?#iefix") format("embedded-opentype"),
         url("${_a._url}/fonts/tabler-icons.woff2") format("woff2"),
         url("${_a._url}/fonts/tabler-icons.woff") format("woff"),
         url("${_a._url}/fonts/tabler-icons.ttf") format("truetype"),
         url("${_a._url}/fonts/tabler-icons.svg#tabler-icons") format("svg");
  }

  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    @font-face {
      font-family: "tabler-icons";
      src: url("${_a._url}/fonts/tabler-icons.svg#tabler-icons") format("svg");
    }
  }
`);
export class TablerIcon extends Icon {
    constructor(attrs) {
        super(attrs);
    }
}
_b = TablerIcon;
TablerIcon.__name__ = "TablerIcon";
(() => {
    _b.prototype.default_view = TablerIconView;
    _b.define(({ String }) => ({
        icon_name: [String],
    }));
})();
//# sourceMappingURL=tabler_icon.js.map