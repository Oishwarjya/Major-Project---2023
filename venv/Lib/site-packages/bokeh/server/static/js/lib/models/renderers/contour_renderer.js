var _a;
import { DataRenderer, DataRendererView } from "./data_renderer";
import { GlyphRenderer } from "./glyph_renderer";
import { build_view } from "../../core/build_views";
export class ContourRendererView extends DataRendererView {
    *children() {
        yield* super.children();
        yield this.fill_view;
        yield this.line_view;
    }
    get glyph_view() {
        if (this.fill_view.glyph.data_size > 0)
            return this.fill_view.glyph;
        else
            return this.line_view.glyph;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const { parent } = this;
        const { fill_renderer, line_renderer } = this.model;
        this.fill_view = await build_view(fill_renderer, { parent });
        this.line_view = await build_view(line_renderer, { parent });
    }
    remove() {
        this.fill_view.remove();
        this.line_view.remove();
        super.remove();
    }
    _render() {
        this.fill_view.render();
        this.line_view.render();
    }
    renderer_view(renderer) {
        if (renderer instanceof GlyphRenderer) {
            if (renderer == this.fill_view.model)
                return this.fill_view;
            if (renderer == this.line_view.model)
                return this.line_view;
        }
        return super.renderer_view(renderer);
    }
}
ContourRendererView.__name__ = "ContourRendererView";
export class ContourRenderer extends DataRenderer {
    constructor(attrs) {
        super(attrs);
    }
    get_selection_manager() {
        return this.fill_renderer.data_source.selection_manager;
    }
}
_a = ContourRenderer;
ContourRenderer.__name__ = "ContourRenderer";
(() => {
    _a.prototype.default_view = ContourRendererView;
    _a.define(({ Array, Number, Ref }) => ({
        fill_renderer: [Ref(GlyphRenderer)],
        line_renderer: [Ref(GlyphRenderer)],
        levels: [Array(Number), []],
    }));
})();
//# sourceMappingURL=contour_renderer.js.map