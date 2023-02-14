var _a;
import { XYGlyph, XYGlyphView } from "./xy_glyph";
import { TextVector } from "../../core/property_mixins";
import * as hittest from "../../core/hittest";
import * as p from "../../core/properties";
import { assert } from "../../core/util/assert";
import { Selection } from "../selections/selection";
import { TextBox } from "../../core/graphics";
export class TextView extends XYGlyphView {
    _set_data(indices) {
        super._set_data(indices);
        this.labels = Array.from(this.text, (value) => {
            const text = `${value}`; // TODO: guarantee correct types earlier
            return value != null ? new TextBox({ text }) : null;
        });
    }
    _render(ctx, indices, data) {
        const { sx, sy, x_offset, y_offset, angle, labels } = data ?? this;
        for (const i of indices) {
            const sx_i = sx[i];
            const sy_i = sy[i];
            const x_offset_i = x_offset.get(i);
            const y_offset_i = y_offset.get(i);
            const angle_i = angle.get(i);
            const label_i = labels[i];
            if (!isFinite(sx_i + sy_i + x_offset_i + y_offset_i + angle_i) || label_i == null)
                continue;
            if (!this.visuals.text.v_doit(i))
                continue;
            label_i.visuals = this.visuals.text.values(i);
            // TODO: perhaps this should be in _map_data()
            label_i.position = {
                sx: sx_i + x_offset_i,
                sy: sy_i + y_offset_i,
            };
            label_i.angle = angle_i;
            label_i.align = "auto";
            label_i.paint(ctx);
        }
    }
    _hit_point(geometry) {
        const { sx, sy } = geometry;
        const indices = [];
        let i = 0;
        for (const label of this.labels) {
            if (label != null) {
                const { p0, p1, p2, p3 } = label.rect();
                if (hittest.point_in_poly(sx, sy, [p0.x, p1.x, p2.x, p3.x], [p0.y, p1.y, p2.y, p3.y]))
                    indices.push(i);
            }
            i += 1;
        }
        return new Selection({ indices });
    }
    scenterxy(i) {
        const label = this.labels[i];
        assert(label != null);
        const { p0, p1, p2, p3 } = label.rect();
        const sxc = (p0.x + p1.x + p2.x + p3.x) / 4;
        const syc = (p0.y + p1.y + p2.y + p3.y) / 4;
        return [sxc, syc];
    }
}
TextView.__name__ = "TextView";
export class Text extends XYGlyph {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Text;
Text.__name__ = "Text";
(() => {
    _a.prototype.default_view = TextView;
    _a.mixins(TextVector);
    _a.define(({}) => ({
        text: [p.NullStringSpec, { field: "text" }],
        angle: [p.AngleSpec, 0],
        x_offset: [p.NumberSpec, 0],
        y_offset: [p.NumberSpec, 0],
    }));
})();
//# sourceMappingURL=text.js.map