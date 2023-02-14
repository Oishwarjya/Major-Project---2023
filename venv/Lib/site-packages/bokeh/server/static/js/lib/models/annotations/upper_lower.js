var _a;
import { DataAnnotation, DataAnnotationView } from "./data_annotation";
import { ScreenArray } from "../../core/types";
import { Dimension } from "../../core/enums";
import * as p from "../../core/properties";
export class UpperLowerView extends DataAnnotationView {
    map_data() {
        const { frame } = this.plot_view;
        const dim = this.model.dimension;
        const xscale = this.coordinates.x_scale;
        const yscale = this.coordinates.y_scale;
        const limit_scale = dim == "height" ? yscale : xscale;
        const base_scale = dim == "height" ? xscale : yscale;
        const limit_view = dim == "height" ? frame.bbox.yview : frame.bbox.xview;
        const base_view = dim == "height" ? frame.bbox.xview : frame.bbox.yview;
        const _lower_sx = (() => {
            switch (this.model.properties.lower.units) {
                case "canvas":
                    return new ScreenArray(this._lower);
                case "screen":
                    return limit_view.v_compute(this._lower);
                case "data":
                    return limit_scale.v_compute(this._lower);
            }
        })();
        const _upper_sx = (() => {
            switch (this.model.properties.upper.units) {
                case "canvas":
                    return new ScreenArray(this._upper);
                case "screen":
                    return limit_view.v_compute(this._upper);
                case "data":
                    return limit_scale.v_compute(this._upper);
            }
        })();
        const _base_sx = (() => {
            switch (this.model.properties.base.units) {
                case "canvas":
                    return new ScreenArray(this._base);
                case "screen":
                    return base_view.v_compute(this._base);
                case "data":
                    return base_scale.v_compute(this._base);
            }
        })();
        const [i, j] = dim == "height" ? [1, 0] : [0, 1];
        const _lower = [_lower_sx, _base_sx];
        const _upper = [_upper_sx, _base_sx];
        this._lower_sx = _lower[i];
        this._lower_sy = _lower[j];
        this._upper_sx = _upper[i];
        this._upper_sy = _upper[j];
    }
}
UpperLowerView.__name__ = "UpperLowerView";
export class XOrYCoordinateSpec extends p.CoordinateSpec {
    constructor() {
        super(...arguments);
        this._value = p.unset;
    }
    get dimension() {
        return this.obj.dimension == "width" ? "x" : "y";
    }
    // XXX: a hack to make a coordinate & unit spec
    get units() {
        return this._value === p.unset ? "data" : this._value.units ?? "data";
    }
}
XOrYCoordinateSpec.__name__ = "XOrYCoordinateSpec";
export class UpperLower extends DataAnnotation {
    constructor(attrs) {
        super(attrs);
    }
}
_a = UpperLower;
UpperLower.__name__ = "UpperLower";
(() => {
    _a.define(() => ({
        dimension: [Dimension, "height"],
        lower: [XOrYCoordinateSpec, { field: "lower" }],
        upper: [XOrYCoordinateSpec, { field: "upper" }],
        base: [XOrYCoordinateSpec, { field: "base" }],
    }));
})();
//# sourceMappingURL=upper_lower.js.map