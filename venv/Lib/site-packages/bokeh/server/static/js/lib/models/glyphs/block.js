var _a;
import { LRTB, LRTBView } from "./lrtb";
import { ScreenArray } from "../../core/types";
import * as p from "../../core/properties";
export class BlockView extends LRTBView {
    async lazy_initialize() {
        await super.lazy_initialize();
        const { webgl } = this.renderer.plot_view.canvas_view;
        if (webgl != null && webgl.regl_wrapper.has_webgl) {
            const { LRTBGL } = await import("./webgl/lrtb");
            this.glglyph = new LRTBGL(webgl.regl_wrapper, this);
        }
    }
    scenterxy(i) {
        const scx = this.sleft[i] / 2 + this.sright[i] / 2;
        const scy = this.stop[i] / 2 + this.sbottom[i] / 2;
        return [scx, scy];
    }
    _lrtb(i) {
        const x_i = this._x[i];
        const y_i = this._y[i];
        const width_i = this.width.get(i);
        const height_i = this.height.get(i);
        const l = Math.min(x_i, x_i + width_i);
        const r = Math.max(x_i, x_i + width_i);
        const t = Math.max(y_i, y_i + height_i);
        const b = Math.min(y_i, y_i + height_i);
        return [l, r, t, b];
    }
    _map_data() {
        const sx = this.renderer.xscale.v_compute(this._x);
        const sy = this.renderer.yscale.v_compute(this._y);
        const sw = this.sdist(this.renderer.xscale, this._x, this.width, "edge");
        const sh = this.sdist(this.renderer.yscale, this._y, this.height, "edge");
        const n = sx.length;
        this.stop = new ScreenArray(n);
        this.sbottom = new ScreenArray(n);
        this.sleft = new ScreenArray(n);
        this.sright = new ScreenArray(n);
        for (let i = 0; i < n; i++) {
            this.stop[i] = sy[i] - sh[i];
            this.sbottom[i] = sy[i];
            this.sleft[i] = sx[i];
            this.sright[i] = sx[i] + sw[i];
        }
        this._clamp_viewport();
    }
}
BlockView.__name__ = "BlockView";
export class Block extends LRTB {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Block;
Block.__name__ = "Block";
(() => {
    _a.prototype.default_view = BlockView;
    _a.define(({}) => ({
        x: [p.XCoordinateSpec, { field: "x" }],
        y: [p.YCoordinateSpec, { field: "y" }],
        width: [p.NumberSpec, { value: 1 }],
        height: [p.NumberSpec, { value: 1 }],
    }));
})();
//# sourceMappingURL=block.js.map