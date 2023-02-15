var _a;
import { TextAnnotation, TextAnnotationView } from "./text_annotation";
import { resolve_angle } from "../../core/util/math";
import { CoordinateUnits, AngleUnits } from "../../core/enums";
import { SideLayout } from "../../core/layout/side_panel";
export class LabelView extends TextAnnotationView {
    update_layout() {
        const { panel } = this;
        if (panel != null)
            this.layout = new SideLayout(panel, () => this.get_size(), false);
        else
            this.layout = undefined;
    }
    _get_size() {
        if (!this.displayed)
            return { width: 0, height: 0 };
        const graphics = this._text_view.graphics();
        const { angle, angle_units } = this.model;
        graphics.angle = resolve_angle(angle, angle_units);
        graphics.visuals = this.visuals.text.values();
        const { width, height } = graphics.size();
        return { width, height };
    }
    _render() {
        const { angle, angle_units } = this.model;
        const rotation = resolve_angle(angle, angle_units);
        const panel = this.layout != null ? this.layout : this.plot_view.frame;
        const xscale = this.coordinates.x_scale;
        const yscale = this.coordinates.y_scale;
        let sx = (() => {
            switch (this.model.x_units) {
                case "canvas":
                    return this.model.x;
                case "screen":
                    return panel.bbox.xview.compute(this.model.x);
                case "data":
                    return xscale.compute(this.model.x);
            }
        })();
        let sy = (() => {
            switch (this.model.y_units) {
                case "canvas":
                    return this.model.y;
                case "screen":
                    return panel.bbox.yview.compute(this.model.y);
                case "data":
                    return yscale.compute(this.model.y);
            }
        })();
        sx += this.model.x_offset;
        sy -= this.model.y_offset;
        this._paint(this.layer.ctx, { sx, sy }, rotation);
    }
}
LabelView.__name__ = "LabelView";
export class Label extends TextAnnotation {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Label;
Label.__name__ = "Label";
(() => {
    _a.prototype.default_view = LabelView;
    _a.define(({ Number, Angle }) => ({
        x: [Number],
        x_units: [CoordinateUnits, "data"],
        y: [Number],
        y_units: [CoordinateUnits, "data"],
        angle: [Angle, 0],
        angle_units: [AngleUnits, "rad"],
        x_offset: [Number, 0],
        y_offset: [Number, 0],
    }));
})();
//# sourceMappingURL=label.js.map