import { Annotation, AnnotationView } from "../annotation";
import { div, display, undisplay, remove } from "../../../core/dom";
import { SideLayout } from "../../../core/layout/side_panel";
export class TextAnnotationView extends AnnotationView {
    update_layout() {
        const { panel } = this;
        if (panel != null)
            this.layout = new SideLayout(panel, () => this.get_size(), true);
        else
            this.layout = undefined;
    }
    initialize() {
        super.initialize();
        this.el = div();
        this.plot_view.canvas_view.add_overlay(this.el);
    }
    remove() {
        remove(this.el);
        super.remove();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.change, () => this.render());
    }
    render() {
        if (!this.model.visible)
            undisplay(this.el);
        super.render();
    }
    _paint(ctx, text, sx, sy, angle) {
        const { el } = this;
        undisplay(el);
        el.textContent = text;
        this.visuals.text.set_value(ctx);
        el.style.position = "absolute";
        el.style.left = `${sx}px`;
        el.style.top = `${sy}px`;
        el.style.color = ctx.fillStyle;
        el.style.webkitTextStroke = `1px ${ctx.strokeStyle}`;
        el.style.font = ctx.font;
        el.style.lineHeight = "normal"; // needed to prevent ipynb css override
        el.style.whiteSpace = "pre";
        const [x_anchor, x_t] = (() => {
            switch (this.visuals.text.text_align.get_value()) {
                case "left": return ["left", "0%"];
                case "center": return ["center", "-50%"];
                case "right": return ["right", "-100%"];
            }
        })();
        const [y_anchor, y_t] = (() => {
            switch (this.visuals.text.text_baseline.get_value()) {
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
            this.visuals.background_fill.set_value(ctx);
            el.style.backgroundColor = ctx.fillStyle;
        }
        if (this.visuals.border_line.doit) {
            this.visuals.border_line.set_value(ctx);
            // attempt to support vector-style ("8 4 8") line dashing for css mode
            el.style.borderStyle = ctx.lineDash.length < 2 ? "solid" : "dashed";
            el.style.borderWidth = `${ctx.lineWidth}px`;
            el.style.borderColor = ctx.strokeStyle;
        }
        display(el);
    }
}
TextAnnotationView.__name__ = "TextAnnotationView";
export class TextAnnotation extends Annotation {
    constructor(attrs) {
        super(attrs);
    }
}
TextAnnotation.__name__ = "TextAnnotation";
//# sourceMappingURL=text_annotation.js.map