var _a;
import { XYGlyph, XYGlyphView } from "./xy_glyph";
import { generic_line_scalar_legend } from "./utils";
import * as mixins from "../../core/property_mixins";
import { StepMode } from "../../core/enums";
import { unreachable } from "../../core/util/assert";
export class StepView extends XYGlyphView {
    async lazy_initialize() {
        await super.lazy_initialize();
        const { webgl } = this.renderer.plot_view.canvas_view;
        if (webgl != null && webgl.regl_wrapper.has_webgl) {
            const { StepGL } = await import("./webgl/step");
            this.glglyph = new StepGL(webgl.regl_wrapper, this);
        }
    }
    _render(ctx, indices, data) {
        const npoints = indices.length;
        if (npoints < 2)
            return;
        const { sx, sy } = data ?? this;
        const mode = this.model.mode;
        this.visuals.line.set_value(ctx);
        let drawing = false;
        let prev_finite = false;
        const i = indices[0];
        let is_finite = isFinite(sx[i] + sy[i]);
        if (mode == "center")
            drawing = this._render_xy(ctx, drawing, is_finite ? sx[i] : NaN, sy[i]);
        for (const i of indices) {
            const next_finite = isFinite(sx[i + 1] + sy[i + 1]);
            switch (mode) {
                case "before":
                    drawing = this._render_xy(ctx, drawing, is_finite ? sx[i] : NaN, sy[i]);
                    if (i < sx.length - 1)
                        drawing = this._render_xy(ctx, drawing, is_finite && next_finite ? sx[i] : NaN, sy[i + 1]);
                    break;
                case "after":
                    drawing = this._render_xy(ctx, drawing, is_finite ? sx[i] : NaN, sy[i]);
                    if (i < sx.length - 1)
                        drawing = this._render_xy(ctx, drawing, is_finite && next_finite ? sx[i + 1] : NaN, sy[i]);
                    break;
                case "center":
                    if (is_finite && next_finite) {
                        const midx = (sx[i] + sx[i + 1]) / 2;
                        drawing = this._render_xy(ctx, drawing, midx, sy[i]);
                        drawing = this._render_xy(ctx, drawing, midx, sy[i + 1]);
                    }
                    else {
                        if (prev_finite)
                            drawing = this._render_xy(ctx, drawing, is_finite ? sx[i] : NaN, sy[i]);
                        drawing = this._render_xy(ctx, drawing, next_finite ? sx[i + 1] : NaN, sy[i + 1]);
                    }
                    break;
                default:
                    unreachable();
            }
            prev_finite = is_finite;
            is_finite = next_finite;
        }
        if (drawing) {
            const i = indices[npoints - 1];
            if (this._render_xy(ctx, drawing, is_finite ? sx[i] : NaN, sy[i]))
                ctx.stroke();
        }
    }
    _render_xy(ctx, drawing, x, y) {
        if (isFinite(x + y)) {
            if (drawing) {
                // Continue with current line
                ctx.lineTo(x, y);
            }
            else {
                // Start new line
                ctx.beginPath();
                ctx.moveTo(x, y);
                drawing = true;
            }
        }
        else if (drawing) {
            // End current line
            ctx.stroke();
            drawing = false;
        }
        return drawing;
    }
    draw_legend_for_index(ctx, bbox, _index) {
        generic_line_scalar_legend(this.visuals, ctx, bbox);
    }
}
StepView.__name__ = "StepView";
export class Step extends XYGlyph {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Step;
Step.__name__ = "Step";
(() => {
    _a.prototype.default_view = StepView;
    _a.mixins(mixins.LineScalar);
    _a.define(() => ({
        mode: [StepMode, "before"],
    }));
})();
//# sourceMappingURL=step.js.map