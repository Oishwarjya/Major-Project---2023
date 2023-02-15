var _a;
import { UpperLower, UpperLowerView } from "./upper_lower";
import { ArrowHead, TeeHead } from "./arrow_head";
import { Indices } from "../../core/types";
import { build_view } from "../../core/build_views";
import { LineVector } from "../../core/property_mixins";
export class WhiskerView extends UpperLowerView {
    *children() {
        yield* super.children();
        const { lower_head, upper_head } = this;
        if (lower_head != null)
            yield lower_head;
        if (upper_head != null)
            yield upper_head;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const { lower_head, upper_head } = this.model;
        if (lower_head != null)
            this.lower_head = await build_view(lower_head, { parent: this });
        if (upper_head != null)
            this.upper_head = await build_view(upper_head, { parent: this });
    }
    set_data(source) {
        super.set_data(source);
        const indices = Indices.all_set(this._lower.length);
        this.lower_head?.set_data(source, indices);
        this.upper_head?.set_data(source, indices);
    }
    paint(ctx) {
        if (this.visuals.line.doit) {
            for (let i = 0, end = this._lower_sx.length; i < end; i++) {
                ctx.beginPath();
                ctx.moveTo(this._lower_sx[i], this._lower_sy[i]);
                ctx.lineTo(this._upper_sx[i], this._upper_sy[i]);
                this.visuals.line.apply(ctx, i);
            }
        }
        const angle = this.model.dimension == "height" ? 0 : Math.PI / 2;
        if (this.lower_head != null) {
            for (let i = 0, end = this._lower_sx.length; i < end; i++) {
                ctx.save();
                ctx.translate(this._lower_sx[i], this._lower_sy[i]);
                ctx.rotate(angle + Math.PI);
                this.lower_head.render(ctx, i);
                ctx.restore();
            }
        }
        if (this.upper_head != null) {
            for (let i = 0, end = this._upper_sx.length; i < end; i++) {
                ctx.save();
                ctx.translate(this._upper_sx[i], this._upper_sy[i]);
                ctx.rotate(angle);
                this.upper_head.render(ctx, i);
                ctx.restore();
            }
        }
    }
}
WhiskerView.__name__ = "WhiskerView";
export class Whisker extends UpperLower {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Whisker;
Whisker.__name__ = "Whisker";
(() => {
    _a.prototype.default_view = WhiskerView;
    _a.mixins(LineVector);
    _a.define(({ Ref, Nullable }) => ({
        lower_head: [Nullable(Ref(ArrowHead)), () => new TeeHead({ size: 10 })],
        upper_head: [Nullable(Ref(ArrowHead)), () => new TeeHead({ size: 10 })],
    }));
    _a.override({
        level: "underlay",
    });
})();
//# sourceMappingURL=whisker.js.map