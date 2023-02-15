var _a;
import { DataAnnotation, DataAnnotationView } from "./data_annotation";
import { ArrowHead, OpenHead } from "./arrow_head";
import { LineVector } from "../../core/property_mixins";
import { CoordinateUnits } from "../../core/enums";
import { ScreenArray } from "../../core/types";
import { build_view } from "../../core/build_views";
import { Indices } from "../../core/types";
import * as p from "../../core/properties";
import { atan2 } from "../../core/util/math";
export class ArrowView extends DataAnnotationView {
    *children() {
        yield* super.children();
        const { start, end } = this;
        if (start != null)
            yield start;
        if (end != null)
            yield end;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const { start, end } = this.model;
        if (start != null)
            this.start = await build_view(start, { parent: this });
        if (end != null)
            this.end = await build_view(end, { parent: this });
    }
    set_data(source) {
        super.set_data(source);
        const indices = Indices.all_set(this._x_start.length);
        this.start?.set_data(source, indices);
        this.end?.set_data(source, indices);
    }
    remove() {
        this.start?.remove();
        this.end?.remove();
        super.remove();
    }
    map_data() {
        const { frame } = this.plot_view;
        const [sx_start, sy_start] = (() => {
            switch (this.model.start_units) {
                case "canvas": {
                    return [
                        new ScreenArray(this._x_start),
                        new ScreenArray(this._y_start),
                    ];
                }
                case "screen": {
                    return [
                        frame.bbox.xview.v_compute(this._x_start),
                        frame.bbox.yview.v_compute(this._y_start),
                    ];
                }
                case "data": {
                    return [
                        this.coordinates.x_scale.v_compute(this._x_start),
                        this.coordinates.y_scale.v_compute(this._y_start),
                    ];
                }
            }
        })();
        const [sx_end, sy_end] = (() => {
            switch (this.model.end_units) {
                case "canvas": {
                    return [
                        new ScreenArray(this._x_end),
                        new ScreenArray(this._y_end),
                    ];
                }
                case "screen": {
                    return [
                        frame.bbox.xview.v_compute(this._x_end),
                        frame.bbox.yview.v_compute(this._y_end),
                    ];
                }
                case "data": {
                    return [
                        this.coordinates.x_scale.v_compute(this._x_end),
                        this.coordinates.y_scale.v_compute(this._y_end),
                    ];
                }
            }
        })();
        this._sx_start = sx_start;
        this._sy_start = sy_start;
        this._sx_end = sx_end;
        this._sy_end = sy_end;
        const n = sx_start.length;
        const angles = this._angles = new ScreenArray(n);
        for (let i = 0; i < n; i++) {
            // arrow head runs orthogonal to arrow body (???)
            angles[i] = Math.PI / 2 + atan2([sx_start[i], sy_start[i]], [sx_end[i], sy_end[i]]);
        }
    }
    paint(ctx) {
        const { start, end } = this;
        const { _sx_start, _sy_start, _sx_end, _sy_end, _angles } = this;
        const { x, y, width, height } = this.plot_view.frame.bbox;
        for (let i = 0, n = _sx_start.length; i < n; i++) {
            if (end != null) {
                ctx.save();
                ctx.translate(_sx_end[i], _sy_end[i]);
                ctx.rotate(_angles[i]);
                end.render(ctx, i);
                ctx.restore();
            }
            if (start != null) {
                ctx.save();
                ctx.translate(_sx_start[i], _sy_start[i]);
                ctx.rotate(_angles[i] + Math.PI);
                start.render(ctx, i);
                ctx.restore();
            }
            if (!this.visuals.line.doit)
                continue;
            ctx.save();
            if (start != null || end != null) {
                ctx.beginPath();
                ctx.rect(x, y, width, height);
                if (end != null) {
                    ctx.save();
                    ctx.translate(_sx_end[i], _sy_end[i]);
                    ctx.rotate(_angles[i]);
                    end.clip(ctx, i);
                    ctx.restore();
                }
                if (start != null) {
                    ctx.save();
                    ctx.translate(_sx_start[i], _sy_start[i]);
                    ctx.rotate(_angles[i] + Math.PI);
                    start.clip(ctx, i);
                    ctx.restore();
                }
                ctx.closePath();
                ctx.clip();
            }
            ctx.beginPath();
            ctx.moveTo(_sx_start[i], _sy_start[i]);
            ctx.lineTo(_sx_end[i], _sy_end[i]);
            this.visuals.line.apply(ctx, i);
            ctx.restore();
        }
    }
}
ArrowView.__name__ = "ArrowView";
export class Arrow extends DataAnnotation {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Arrow;
Arrow.__name__ = "Arrow";
(() => {
    _a.prototype.default_view = ArrowView;
    _a.mixins(LineVector);
    _a.define(({ Ref, Nullable }) => ({
        x_start: [p.XCoordinateSpec, { field: "x_start" }],
        y_start: [p.YCoordinateSpec, { field: "y_start" }],
        start_units: [CoordinateUnits, "data"],
        start: [Nullable(Ref(ArrowHead)), null],
        x_end: [p.XCoordinateSpec, { field: "x_end" }],
        y_end: [p.YCoordinateSpec, { field: "y_end" }],
        end_units: [CoordinateUnits, "data"],
        end: [Nullable(Ref(ArrowHead)), () => new OpenHead()],
    }));
})();
//# sourceMappingURL=arrow.js.map