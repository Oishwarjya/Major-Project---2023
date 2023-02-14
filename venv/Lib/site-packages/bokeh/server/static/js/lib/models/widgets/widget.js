import { LayoutDOM, LayoutDOMView } from "../layouts/layout_dom";
import { default_provider } from "../text/providers";
export class WidgetView extends LayoutDOMView {
    update_style() {
        super.update_style();
        this.style.append(":host", { margin: "5px" });
    }
    get child_models() {
        return [];
    }
    get provider() {
        return default_provider;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        if (this.provider.status == "not_started")
            await this.provider.fetch();
    }
    _after_layout() {
        super._after_layout();
        if (this.provider.status == "loading")
            this._has_finished = false;
    }
    process_tex(text) {
        if (!this.provider.MathJax)
            return text;
        const tex_parts = this.provider.MathJax.find_tex(text);
        const processed_text = [];
        let last_index = 0;
        for (const part of tex_parts) {
            processed_text.push(text.slice(last_index, part.start.n));
            processed_text.push(this.provider.MathJax.tex2svg(part.math, { display: part.display }).outerHTML);
            last_index = part.end.n;
        }
        if (last_index < text.length)
            processed_text.push(text.slice(last_index));
        return processed_text.join("");
    }
    contains_tex_string(text) {
        if (!this.provider.MathJax)
            return false;
        return this.provider.MathJax.find_tex(text).length > 0;
    }
    ;
}
WidgetView.__name__ = "WidgetView";
export class Widget extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
}
Widget.__name__ = "Widget";
//# sourceMappingURL=widget.js.map