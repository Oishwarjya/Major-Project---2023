var _a, _b, _c, _d, _e;
import { Marking, MarkingView } from "../graphics/marking";
import { LineVector, FillVector } from "../../core/property_mixins";
import * as p from "../../core/properties";
export class ArrowHeadView extends MarkingView {
}
ArrowHeadView.__name__ = "ArrowHeadView";
export class ArrowHead extends Marking {
    constructor(attrs) {
        super(attrs);
    }
}
_a = ArrowHead;
ArrowHead.__name__ = "ArrowHead";
(() => {
    _a.define(() => ({
        size: [p.NumberSpec, 25],
    }));
})();
export class OpenHeadView extends ArrowHeadView {
    clip(ctx, i) {
        this.visuals.line.set_vectorize(ctx, i);
        const size_i = this.size.get(i);
        ctx.moveTo(0.5 * size_i, size_i);
        ctx.lineTo(0.5 * size_i, -2);
        ctx.lineTo(-0.5 * size_i, -2);
        ctx.lineTo(-0.5 * size_i, size_i);
        ctx.lineTo(0, 0);
        ctx.lineTo(0.5 * size_i, size_i);
    }
    render(ctx, i) {
        const size_i = this.size.get(i);
        ctx.beginPath();
        ctx.moveTo(0.5 * size_i, size_i);
        ctx.lineTo(0, 0);
        ctx.lineTo(-0.5 * size_i, size_i);
        this.visuals.line.apply(ctx, i);
    }
}
OpenHeadView.__name__ = "OpenHeadView";
export class OpenHead extends ArrowHead {
    constructor(attrs) {
        super(attrs);
    }
}
_b = OpenHead;
OpenHead.__name__ = "OpenHead";
(() => {
    _b.prototype.default_view = OpenHeadView;
    _b.mixins(LineVector);
})();
export class NormalHeadView extends ArrowHeadView {
    clip(ctx, i) {
        this.visuals.line.set_vectorize(ctx, i);
        const size_i = this.size.get(i);
        ctx.moveTo(0.5 * size_i, size_i);
        ctx.lineTo(0.5 * size_i, -2);
        ctx.lineTo(-0.5 * size_i, -2);
        ctx.lineTo(-0.5 * size_i, size_i);
        ctx.lineTo(0.5 * size_i, size_i);
    }
    render(ctx, i) {
        const size_i = this.size.get(i);
        ctx.beginPath();
        ctx.moveTo(0.5 * size_i, size_i);
        ctx.lineTo(0, 0);
        ctx.lineTo(-0.5 * size_i, size_i);
        ctx.closePath();
        this.visuals.fill.apply(ctx, i);
        this.visuals.line.apply(ctx, i);
    }
}
NormalHeadView.__name__ = "NormalHeadView";
export class NormalHead extends ArrowHead {
    constructor(attrs) {
        super(attrs);
    }
}
_c = NormalHead;
NormalHead.__name__ = "NormalHead";
(() => {
    _c.prototype.default_view = NormalHeadView;
    _c.mixins([LineVector, FillVector]);
    _c.override({
        fill_color: "black",
    });
})();
export class VeeHeadView extends ArrowHeadView {
    clip(ctx, i) {
        this.visuals.line.set_vectorize(ctx, i);
        const size_i = this.size.get(i);
        ctx.moveTo(0.5 * size_i, size_i);
        ctx.lineTo(0.5 * size_i, -2);
        ctx.lineTo(-0.5 * size_i, -2);
        ctx.lineTo(-0.5 * size_i, size_i);
        ctx.lineTo(0, 0.5 * size_i);
        ctx.lineTo(0.5 * size_i, size_i);
    }
    render(ctx, i) {
        const size_i = this.size.get(i);
        ctx.beginPath();
        ctx.moveTo(0.5 * size_i, size_i);
        ctx.lineTo(0, 0);
        ctx.lineTo(-0.5 * size_i, size_i);
        ctx.lineTo(0, 0.5 * size_i);
        ctx.closePath();
        this.visuals.fill.apply(ctx, i);
        this.visuals.line.apply(ctx, i);
    }
}
VeeHeadView.__name__ = "VeeHeadView";
export class VeeHead extends ArrowHead {
    constructor(attrs) {
        super(attrs);
    }
}
_d = VeeHead;
VeeHead.__name__ = "VeeHead";
(() => {
    _d.prototype.default_view = VeeHeadView;
    _d.mixins([LineVector, FillVector]);
    _d.override({
        fill_color: "black",
    });
})();
export class TeeHeadView extends ArrowHeadView {
    render(ctx, i) {
        const size_i = this.size.get(i);
        ctx.beginPath();
        ctx.moveTo(0.5 * size_i, 0);
        ctx.lineTo(-0.5 * size_i, 0);
        this.visuals.line.apply(ctx, i);
    }
    clip(_ctx, _i) { }
}
TeeHeadView.__name__ = "TeeHeadView";
export class TeeHead extends ArrowHead {
    constructor(attrs) {
        super(attrs);
    }
}
_e = TeeHead;
TeeHead.__name__ = "TeeHead";
(() => {
    _e.prototype.default_view = TeeHeadView;
    _e.mixins(LineVector);
})();
//# sourceMappingURL=arrow_head.js.map