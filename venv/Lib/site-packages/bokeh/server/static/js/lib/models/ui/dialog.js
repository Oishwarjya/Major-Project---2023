var _a;
import { UIElement, UIElementView } from "../ui/ui_element";
import { DOMNode } from "../dom/dom_node";
import { Text } from "../dom/text";
import { div } from "../../core/dom";
import { isString } from "../../core/util/types";
import { build_view } from "../../core/build_views";
import dialogs_css, * as dialogs from "../../styles/dialogs.css";
import icons_css from "../../styles/icons.css";
const Button = UIElement;
export class DialogView extends UIElementView {
    *children() {
        yield* super.children();
        yield this._content;
    }
    styles() {
        return [...super.styles(), dialogs_css, icons_css];
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const content = (() => {
            const { content } = this.model;
            return isString(content) ? new Text({ content }) : content;
        })();
        this._content = await build_view(content, { parent: this });
    }
    connect_signals() {
        super.connect_signals();
        const { visible } = this.model.properties;
        this.on_change(visible, () => this.render());
    }
    remove() {
        this._content.remove();
        super.remove();
    }
    render() {
        super.render();
        if (!this.model.visible) {
            this.el.remove();
            return;
        }
        document.body.appendChild(this.el);
        this._content.render();
        const title = div({ class: dialogs.title });
        const content = div({ class: dialogs.content }, this._content.el);
        const buttons = div({ class: dialogs.buttons });
        this.shadow_el.appendChild(title);
        this.shadow_el.appendChild(content);
        this.shadow_el.appendChild(buttons);
        if (this.model.closable) {
            const close = div({ class: dialogs.close });
            close.addEventListener("click", () => this.model.visible = false);
            this.shadow_el.appendChild(close);
        }
    }
}
DialogView.__name__ = "DialogView";
export class Dialog extends UIElement {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Dialog;
Dialog.__name__ = "Dialog";
(() => {
    _a.prototype.default_view = DialogView;
    _a.define(({ Boolean, String, Array, Ref, Or, Nullable }) => ({
        title: [Nullable(Or(String, Ref(DOMNode))), null],
        content: [Or(String, Ref(DOMNode), Ref(UIElement))],
        buttons: [Array(Ref(Button)), []],
        modal: [Boolean, false],
        closable: [Boolean, true],
        draggable: [Boolean, true],
    }));
})();
//# sourceMappingURL=dialog.js.map