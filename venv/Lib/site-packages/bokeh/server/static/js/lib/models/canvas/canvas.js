var _a;
import { settings } from "../../core/settings";
import { logger } from "../../core/logging";
import { div, append } from "../../core/dom";
import { OutputBackend } from "../../core/enums";
import { UIEventBus } from "../../core/ui_events";
import { load_module } from "../../core/util/modules";
import { CanvasLayer } from "../../core/util/canvas";
import { UIElement, UIElementView } from "../ui/ui_element";
import { StyleSheet } from "../../core/dom";
import canvas_css from "../../styles/canvas.css";
async function init_webgl() {
    // We use a global invisible canvas and gl context. By having a global context,
    // we avoid the limitation of max 16 contexts that most browsers have.
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true });
    // If WebGL is available, we store a reference to the ReGL wrapper on
    // the ctx object, because that's what gets passed everywhere.
    if (gl != null) {
        const webgl = await load_module(import("../glyphs/webgl"));
        if (webgl != null) {
            const regl_wrapper = webgl.get_regl(gl);
            if (regl_wrapper.has_webgl) {
                return { canvas, regl_wrapper };
            }
            else {
                logger.trace("WebGL is supported, but not the required extensions");
            }
        }
        else {
            logger.trace("WebGL is supported, but bokehjs(.min).js bundle is not available");
        }
    }
    else {
        logger.trace("WebGL is not supported");
    }
    return null;
}
const global_webgl = (() => {
    let _global_webgl;
    return async () => {
        if (_global_webgl !== undefined)
            return _global_webgl;
        else
            return _global_webgl = await init_webgl();
    };
})();
export class CanvasView extends UIElementView {
    constructor() {
        super(...arguments);
        this.webgl = null;
        this._size = new StyleSheet();
        this.plot_views = [];
    }
    initialize() {
        super.initialize();
        this.underlays_el = div({ class: "bk-layer" });
        this.primary = this.create_layer();
        this.overlays = this.create_layer();
        this.overlays_el = div({ class: "bk-layer" });
        this.events_el = div({ class: ["bk-layer", "bk-events"] });
        this.ui_event_bus = new UIEventBus(this);
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        if (this.model.output_backend == "webgl") {
            this.webgl = await global_webgl();
            if (settings.force_webgl && this.webgl == null)
                throw new Error("webgl is not available");
        }
    }
    remove() {
        this.ui_event_bus.destroy();
        super.remove();
    }
    styles() {
        return [...super.styles(), canvas_css, this._size];
    }
    render() {
        super.render();
        const elements = [
            this.underlays_el,
            this.primary.el,
            this.overlays.el,
            this.overlays_el,
            this.events_el,
        ];
        append(this.shadow_el, ...elements);
    }
    add_underlay(el) {
        this.underlays_el.appendChild(el);
    }
    add_overlay(el) {
        this.overlays_el.appendChild(el);
    }
    add_event(el) {
        this.events_el.appendChild(el);
    }
    get pixel_ratio() {
        return this.primary.pixel_ratio; // XXX: primary
    }
    _update_bbox() {
        super._update_bbox();
        const { width, height } = this.bbox;
        this._size.replace(`
    .bk-layer {
      width: ${width}px;
      height: ${height}px;
    }
    `);
    }
    _after_resize() {
        if (this.plot_views.length != 0)
            return; // XXX temporary hack
        super._after_resize();
        const { width, height } = this.bbox;
        this.primary.resize(width, height);
        this.overlays.resize(width, height);
    }
    resize() {
        this._update_bbox();
        const { width, height } = this.bbox;
        this.primary.resize(width, height);
        this.overlays.resize(width, height);
    }
    prepare_webgl(frame_box) {
        // Prepare WebGL for a drawing pass
        const { webgl } = this;
        if (webgl != null) {
            // Sync canvas size
            const { width, height } = this.bbox;
            webgl.canvas.width = this.pixel_ratio * width;
            webgl.canvas.height = this.pixel_ratio * height;
            const [sx, sy, w, h] = frame_box;
            const { xview, yview } = this.bbox;
            const vx = xview.compute(sx);
            const vy = yview.compute(sy + h);
            const ratio = this.pixel_ratio;
            webgl.regl_wrapper.set_scissor(ratio * vx, ratio * vy, ratio * w, ratio * h);
            this._clear_webgl();
        }
    }
    blit_webgl(ctx) {
        // This should be called when the ctx has no state except the HIDPI transform
        const { webgl } = this;
        if (webgl != null) {
            // Blit gl canvas into the 2D canvas. To do 1-on-1 blitting, we need
            // to remove the hidpi transform, then blit, then restore.
            // ctx.globalCompositeOperation = "source-over"  -> OK; is the default
            logger.debug("Blitting WebGL canvas");
            ctx.restore();
            ctx.drawImage(webgl.canvas, 0, 0);
            // Set back hidpi transform
            ctx.save();
            if (this.model.hidpi) {
                const ratio = this.pixel_ratio;
                ctx.scale(ratio, ratio);
                ctx.translate(0.5, 0.5);
            }
            this._clear_webgl();
        }
    }
    _clear_webgl() {
        const { webgl } = this;
        if (webgl != null) {
            // Prepare GL for drawing
            const { regl_wrapper, canvas } = webgl;
            regl_wrapper.clear(canvas.width, canvas.height);
        }
    }
    compose() {
        const composite = this.create_layer();
        const { width, height } = this.bbox;
        composite.resize(width, height);
        composite.ctx.drawImage(this.primary.canvas, 0, 0);
        composite.ctx.drawImage(this.overlays.canvas, 0, 0);
        return composite;
    }
    create_layer() {
        const { output_backend, hidpi } = this.model;
        return new CanvasLayer(output_backend, hidpi);
    }
    to_blob() {
        return this.compose().to_blob();
    }
}
CanvasView.__name__ = "CanvasView";
export class Canvas extends UIElement {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Canvas;
Canvas.__name__ = "Canvas";
(() => {
    _a.prototype.default_view = CanvasView;
    _a.define(({ Boolean }) => ({
        hidpi: [Boolean, true],
        output_backend: [OutputBackend, "canvas"],
    }));
})();
//# sourceMappingURL=canvas.js.map