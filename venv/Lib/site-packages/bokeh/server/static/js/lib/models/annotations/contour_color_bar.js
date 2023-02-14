var _a;
import { BaseColorBar, BaseColorBarView } from "./base_color_bar";
import { Range1d } from "../ranges";
import { GlyphRenderer } from "../renderers/glyph_renderer";
import { build_view } from "../../core/build_views";
import { assert } from "../../core/util/assert";
export class ContourColorBarView extends BaseColorBarView {
    *children() {
        yield* super.children();
        yield this._fill_view;
        yield this._line_view;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const { fill_renderer, line_renderer } = this.model;
        this._fill_view = await build_view(fill_renderer, { parent: this.parent });
        this._line_view = await build_view(line_renderer, { parent: this.parent });
    }
    remove() {
        this._fill_view.remove();
        this._line_view.remove();
        super.remove();
    }
    _create_major_range() {
        const levels = this.model.levels;
        if (levels.length > 0) {
            return new Range1d({ start: levels[0], end: levels[levels.length - 1] });
        }
        else {
            return new Range1d({ start: 0, end: 1 });
        }
    }
    _paint_colors(ctx, bbox) {
        const vertical = this.orientation == "vertical";
        const levels = this.model.levels;
        const scale = this._major_scale;
        scale.source_range = this._major_range;
        if (vertical)
            scale.target_range = new Range1d({ start: bbox.bottom, end: bbox.top });
        else
            scale.target_range = new Range1d({ start: bbox.left, end: bbox.right });
        const scaled_levels = scale.v_compute(levels);
        const multi_polygons = this._fill_view.glyph;
        const nfill = multi_polygons.data_size;
        if (nfill > 0) {
            assert(levels.length == nfill + 1, "Inconsistent number of filled contour levels");
            ctx.save();
            for (let i = 0; i < nfill; i++) {
                ctx.beginPath();
                if (vertical)
                    ctx.rect(bbox.left, scaled_levels[i], bbox.width, scaled_levels[i + 1] - scaled_levels[i]);
                else
                    ctx.rect(scaled_levels[i], bbox.top, scaled_levels[i + 1] - scaled_levels[i], bbox.height);
                multi_polygons.visuals.fill.apply(ctx, i);
                multi_polygons.visuals.hatch.apply(ctx, i);
            }
            ctx.restore();
        }
        const multi_line = this._line_view.glyph;
        const nline = multi_line.data_size;
        if (nline > 0) {
            assert(levels.length == nline, "Inconsistent number of line contour levels");
            ctx.save();
            for (let i = 0; i < nline; i++) {
                ctx.beginPath();
                if (vertical) {
                    ctx.moveTo(bbox.left, scaled_levels[i]);
                    ctx.lineTo(bbox.right, scaled_levels[i]);
                }
                else {
                    ctx.moveTo(scaled_levels[i], bbox.bottom);
                    ctx.lineTo(scaled_levels[i], bbox.top);
                }
                multi_line.visuals.line.set_vectorize(ctx, i);
                ctx.stroke();
            }
            ctx.restore();
        }
    }
}
ContourColorBarView.__name__ = "ContourColorBarView";
export class ContourColorBar extends BaseColorBar {
    constructor(attrs) {
        super(attrs);
    }
}
_a = ContourColorBar;
ContourColorBar.__name__ = "ContourColorBar";
(() => {
    _a.prototype.default_view = ContourColorBarView;
    _a.define(({ Array, Number, Ref }) => ({
        fill_renderer: [Ref(GlyphRenderer)],
        line_renderer: [Ref(GlyphRenderer)],
        levels: [Array(Number), []],
    }));
})();
//# sourceMappingURL=contour_color_bar.js.map