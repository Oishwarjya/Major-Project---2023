var _a;
import { DataAnnotation, DataAnnotationView } from "../data_annotation";
import * as mixins from "../../../core/property_mixins";
import { CoordinateUnits } from "../../../core/enums";
import { div, display, remove } from "../../../core/dom";
import * as p from "../../../core/properties";
import { ScreenArray } from "../../../core/types";
import { assert } from "../../../core/util/assert";
export class HTMLLabelSetView extends DataAnnotationView {
    constructor() {
        super(...arguments);
        this.els = [];
    }
    set_data(source) {
        super.set_data(source);
        this.els.forEach((el) => remove(el));
        this.els = [];
        for (const _ of this.text) {
            const el = div({ style: { display: "none" } });
            this.plot_view.canvas_view.add_overlay(el);
            this.els.push(el);
        }
    }
    remove() {
        this.els.forEach((el) => remove(el));
        this.els = [];
        super.remove();
    }
    _rerender() {
        this.render();
    }
    map_data() {
        const { x_scale, y_scale } = this.coordinates;
        const panel = this.layout != null ? this.layout : this.plot_view.frame;
        this.sx = (() => {
            switch (this.model.x_units) {
                case "canvas":
                    return new ScreenArray(this._x);
                case "screen":
                    return panel.bbox.xview.v_compute(this._x);
                case "data":
                    return x_scale.v_compute(this._x);
            }
        })();
        this.sy = (() => {
            switch (this.model.y_units) {
                case "canvas":
                    return new ScreenArray(this._y);
                case "screen":
                    return panel.bbox.yview.v_compute(this._y);
                case "data":
                    return y_scale.v_compute(this._y);
            }
        })();
    }
    paint() {
        const { ctx } = this.layer;
        for (let i = 0, end = this.text.length; i < end; i++) {
            const x_offset_i = this.x_offset.get(i);
            const y_offset_i = this.y_offset.get(i);
            const sx_i = this.sx[i] + x_offset_i;
            const sy_i = this.sy[i] - y_offset_i;
            const angle_i = this.angle.get(i);
            const text_i = this.text.get(i);
            if (!isFinite(sx_i + sy_i + angle_i) || text_i == null)
                continue;
            this._paint(ctx, i, text_i, sx_i, sy_i, angle_i);
        }
    }
    _paint(ctx, i, text, sx, sy, angle) {
        assert(i in this.els);
        const el = this.els[i];
        el.textContent = text;
        this.visuals.text.set_vectorize(ctx, i);
        el.style.position = "absolute";
        el.style.left = `${sx}px`;
        el.style.top = `${sy}px`;
        el.style.color = ctx.fillStyle;
        el.style.webkitTextStroke = `1px ${ctx.strokeStyle}`;
        el.style.font = ctx.font;
        el.style.lineHeight = "normal"; // needed to prevent ipynb css override
        el.style.whiteSpace = "pre";
        const [x_anchor, x_t] = (() => {
            switch (this.visuals.text.text_align.get(i)) {
                case "left": return ["left", "0%"];
                case "center": return ["center", "-50%"];
                case "right": return ["right", "-100%"];
            }
        })();
        const [y_anchor, y_t] = (() => {
            switch (this.visuals.text.text_baseline.get(i)) {
                case "top": return ["top", "0%"];
                case "middle": return ["center", "-50%"];
                case "bottom": return ["bottom", "-100%"];
                default: return ["center", "-50%"]; // "baseline"
            }
        })();
        let transform = `translate(${x_t}, ${y_t})`;
        if (angle) {
            transform += `rotate(${angle}rad)`;
        }
        el.style.transformOrigin = `${x_anchor} ${y_anchor}`;
        el.style.transform = transform;
        if (this.layout == null) {
            // const {bbox} = this.plot_view.frame
            // const {left, right, top, bottom} = bbox
            // el.style.clipPath = ???
        }
        if (this.visuals.background_fill.doit) {
            this.visuals.background_fill.set_vectorize(ctx, i);
            el.style.backgroundColor = ctx.fillStyle;
        }
        if (this.visuals.border_line.doit) {
            this.visuals.border_line.set_vectorize(ctx, i);
            // attempt to support vector-style ("8 4 8") line dashing for css mode
            el.style.borderStyle = ctx.lineDash.length < 2 ? "solid" : "dashed";
            el.style.borderWidth = `${ctx.lineWidth}px`;
            el.style.borderColor = ctx.strokeStyle;
        }
        display(el);
    }
}
HTMLLabelSetView.__name__ = "HTMLLabelSetView";
export class HTMLLabelSet extends DataAnnotation {
    constructor(attrs) {
        super(attrs);
    }
}
_a = HTMLLabelSet;
HTMLLabelSet.__name__ = "HTMLLabelSet";
(() => {
    _a.prototype.default_view = HTMLLabelSetView;
    _a.mixins([
        mixins.TextVector,
        ["border_", mixins.LineVector],
        ["background_", mixins.FillVector],
    ]);
    _a.define(() => ({
        x: [p.XCoordinateSpec, { field: "x" }],
        y: [p.YCoordinateSpec, { field: "y" }],
        x_units: [CoordinateUnits, "data"],
        y_units: [CoordinateUnits, "data"],
        text: [p.NullStringSpec, { field: "text" }],
        angle: [p.AngleSpec, 0],
        x_offset: [p.NumberSpec, { value: 0 }],
        y_offset: [p.NumberSpec, { value: 0 }],
    }));
    _a.override({
        background_fill_color: null,
        border_line_color: null,
    });
})();
//# sourceMappingURL=label_set.js.map