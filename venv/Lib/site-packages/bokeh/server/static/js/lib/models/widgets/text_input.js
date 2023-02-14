var _a;
import { TextLikeInput, TextLikeInputView } from "./text_like_input";
import { input, div } from "../../core/dom";
import * as inputs from "../../styles/widgets/inputs.css";
export class TextInputView extends TextLikeInputView {
    connect_signals() {
        super.connect_signals();
        const { prefix, suffix } = this.model.properties;
        this.on_change([prefix, suffix], () => this.render());
    }
    _render_input() {
        this.input_el = input({ type: "text", class: inputs.input });
        const { prefix, suffix } = this.model;
        const prefix_el = prefix != null ? div({ class: "bk-input-prefix" }, prefix) : null;
        const suffix_el = suffix != null ? div({ class: "bk-input-suffix" }, suffix) : null;
        const container_el = div({ class: "bk-input-container" }, prefix_el, this.input_el, suffix_el);
        return container_el;
    }
}
TextInputView.__name__ = "TextInputView";
export class TextInput extends TextLikeInput {
    constructor(attrs) {
        super(attrs);
    }
}
_a = TextInput;
TextInput.__name__ = "TextInput";
(() => {
    _a.prototype.default_view = TextInputView;
    _a.define(({ String, Nullable }) => ({
        prefix: [Nullable(String), null],
        suffix: [Nullable(String), null],
    }));
})();
//# sourceMappingURL=text_input.js.map