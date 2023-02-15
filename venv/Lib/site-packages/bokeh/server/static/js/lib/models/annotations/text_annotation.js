var _a;
import { Annotation, AnnotationView } from "./annotation";
import { SideLayout } from "../../core/layout/side_panel";
import { BaseText } from "../text/base_text";
import { build_view } from "../../core/build_views";
import { isString } from "../../core/util/types";
import { parse_delimited_string } from "../text/utils";
import * as mixins from "../../core/property_mixins";
export class TextAnnotationView extends AnnotationView {
    *children() {
        yield* super.children();
        yield this._text_view;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        await this._init_text();
    }
    async _init_text() {
        const { text } = this.model;
        const _text = isString(text) ? parse_delimited_string(text) : text;
        this._text_view = await build_view(_text, { parent: this });
    }
    update_layout() {
        const { panel } = this;
        if (panel != null)
            this.layout = new SideLayout(panel, () => this.get_size(), true);
        else
            this.layout = undefined;
    }
    connect_signals() {
        super.connect_signals();
        const { text } = this.model.properties;
        this.on_change(text, async () => {
            this._text_view.remove();
            await this._init_text();
        });
        this.connect(this.model.change, () => this.request_render());
    }
    remove() {
        this._text_view.remove();
        super.remove();
    }
    has_finished() {
        if (!super.has_finished())
            return false;
        if (!this._text_view.has_finished())
            return false;
        return true;
    }
    get displayed() {
        return super.displayed && this._text_view.model.text != "" && this.visuals.text.doit;
    }
    _paint(ctx, position, angle) {
        const graphics = this._text_view.graphics();
        graphics.angle = angle;
        graphics.position = position;
        graphics.align = "auto";
        graphics.visuals = this.visuals.text.values();
        const { background_fill, border_line } = this.visuals;
        if (background_fill.doit || border_line.doit) {
            const { p0, p1, p2, p3 } = graphics.rect();
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.lineTo(p3.x, p3.y);
            ctx.closePath();
            this.visuals.background_fill.apply(ctx);
            this.visuals.border_line.apply(ctx);
        }
        if (this.visuals.text.doit)
            graphics.paint(ctx);
    }
}
TextAnnotationView.__name__ = "TextAnnotationView";
export class TextAnnotation extends Annotation {
    constructor(attrs) {
        super(attrs);
    }
}
_a = TextAnnotation;
TextAnnotation.__name__ = "TextAnnotation";
(() => {
    _a.mixins([
        mixins.Text,
        ["border_", mixins.Line],
        ["background_", mixins.Fill],
    ]);
    _a.define(({ String, Or, Ref }) => ({
        text: [Or(String, Ref(BaseText)), ""],
    }));
    _a.override({
        background_fill_color: null,
        border_line_color: null,
    });
})();
//# sourceMappingURL=text_annotation.js.map