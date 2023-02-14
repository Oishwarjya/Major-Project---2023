var _a;
import { Annotation, AnnotationView } from "./annotation";
import * as mixins from "../../core/property_mixins";
import { CoordinateUnits } from "../../core/enums";
import { copy } from "../../core/util/array";
export class PolyAnnotationView extends AnnotationView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.change, () => this.request_render());
    }
    _render() {
        const { xs, ys } = this.model;
        if (xs.length != ys.length)
            return;
        const n = xs.length;
        if (n < 3)
            return;
        const { frame } = this.plot_view;
        const { ctx } = this.layer;
        const xscale = this.coordinates.x_scale;
        const yscale = this.coordinates.y_scale;
        function _calc_dim(values, units, scale, view) {
            switch (units) {
                case "canvas":
                    return values;
                case "screen":
                    return view.v_compute(values);
                case "data":
                    return scale.v_compute(values);
            }
        }
        const sxs = _calc_dim(xs, this.model.xs_units, xscale, frame.bbox.xview);
        const sys = _calc_dim(ys, this.model.ys_units, yscale, frame.bbox.yview);
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
            ctx.lineTo(sxs[i], sys[i]);
        }
        ctx.closePath();
        this.visuals.fill.apply(ctx);
        this.visuals.hatch.apply(ctx);
        this.visuals.line.apply(ctx);
    }
}
PolyAnnotationView.__name__ = "PolyAnnotationView";
export class PolyAnnotation extends Annotation {
    constructor(attrs) {
        super(attrs);
    }
    update({ xs, ys }) {
        this.setv({ xs: copy(xs), ys: copy(ys), visible: true });
    }
    clear() {
        this.setv({ xs: [], ys: [], visible: false });
    }
}
_a = PolyAnnotation;
PolyAnnotation.__name__ = "PolyAnnotation";
(() => {
    _a.prototype.default_view = PolyAnnotationView;
    _a.mixins([mixins.Line, mixins.Fill, mixins.Hatch]);
    _a.define(({ Number, Array }) => ({
        xs: [Array(Number), []],
        ys: [Array(Number), []],
        xs_units: [CoordinateUnits, "data"],
        ys_units: [CoordinateUnits, "data"],
    }));
    _a.override({
        fill_color: "#fff9ba",
        fill_alpha: 0.4,
        line_color: "#cccccc",
        line_alpha: 0.3,
    });
})();
//# sourceMappingURL=poly_annotation.js.map