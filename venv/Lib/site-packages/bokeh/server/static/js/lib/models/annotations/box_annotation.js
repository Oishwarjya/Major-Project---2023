var _a;
import { Annotation, AnnotationView } from "./annotation";
import * as mixins from "../../core/property_mixins";
import { CoordinateUnits } from "../../core/enums";
import { BBox } from "../../core/util/bbox";
export const EDGE_TOLERANCE = 2.5;
export class BoxAnnotationView extends AnnotationView {
    constructor() {
        super(...arguments);
        this.bbox = new BBox();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.change, () => this.request_render());
    }
    _render() {
        const { left, right, top, bottom } = this.model;
        const { frame } = this.plot_view;
        const xscale = this.coordinates.x_scale;
        const yscale = this.coordinates.y_scale;
        const _calc_dim = (dim, dim_units, scale, view, frame_extrema) => {
            if (dim == null)
                return frame_extrema;
            else {
                switch (dim_units) {
                    case "canvas":
                        return dim;
                    case "screen":
                        return view.compute(dim);
                    case "data":
                        return scale.compute(dim);
                }
            }
        };
        this.bbox = BBox.from_lrtb({
            left: _calc_dim(left, this.model.left_units, xscale, frame.bbox.xview, frame.bbox.left),
            right: _calc_dim(right, this.model.right_units, xscale, frame.bbox.xview, frame.bbox.right),
            top: _calc_dim(top, this.model.top_units, yscale, frame.bbox.yview, frame.bbox.top),
            bottom: _calc_dim(bottom, this.model.bottom_units, yscale, frame.bbox.yview, frame.bbox.bottom),
        });
        this._paint_box();
    }
    _paint_box() {
        const { ctx } = this.layer;
        ctx.save();
        const { left, top, width, height } = this.bbox;
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        this.visuals.fill.apply(ctx);
        this.visuals.hatch.apply(ctx);
        this.visuals.line.apply(ctx);
        ctx.restore();
    }
    interactive_bbox() {
        const tolerance = this.model.line_width + EDGE_TOLERANCE;
        return this.bbox.grow_by(tolerance);
    }
    interactive_hit(sx, sy) {
        if (this.model.in_cursor == null)
            return false;
        const bbox = this.interactive_bbox();
        return bbox.contains(sx, sy);
    }
    cursor(sx, sy) {
        const tol = 3;
        const { left, right, bottom, top } = this.bbox;
        if (Math.abs(sx - left) < tol || Math.abs(sx - right) < tol)
            return this.model.ew_cursor;
        else if (Math.abs(sy - bottom) < tol || Math.abs(sy - top) < tol)
            return this.model.ns_cursor;
        else if (this.bbox.contains(sx, sy))
            return this.model.in_cursor;
        else
            return null;
    }
}
BoxAnnotationView.__name__ = "BoxAnnotationView";
export class BoxAnnotation extends Annotation {
    constructor(attrs) {
        super(attrs);
    }
    update({ left, right, top, bottom }) {
        this.setv({ left, right, top, bottom, visible: true });
    }
    clear() {
        this.visible = false;
    }
}
_a = BoxAnnotation;
BoxAnnotation.__name__ = "BoxAnnotation";
(() => {
    _a.prototype.default_view = BoxAnnotationView;
    _a.mixins([mixins.Line, mixins.Fill, mixins.Hatch]);
    _a.define(({ Number, Nullable }) => ({
        top: [Nullable(Number), null],
        bottom: [Nullable(Number), null],
        left: [Nullable(Number), null],
        right: [Nullable(Number), null],
        top_units: [CoordinateUnits, "data"],
        bottom_units: [CoordinateUnits, "data"],
        left_units: [CoordinateUnits, "data"],
        right_units: [CoordinateUnits, "data"],
    }));
    _a.internal(({ String, Nullable }) => ({
        ew_cursor: [Nullable(String), null],
        ns_cursor: [Nullable(String), null],
        in_cursor: [Nullable(String), null],
    }));
    _a.override({
        fill_color: "#fff9ba",
        fill_alpha: 0.4,
        line_color: "#cccccc",
        line_alpha: 0.3,
    });
})();
//# sourceMappingURL=box_annotation.js.map