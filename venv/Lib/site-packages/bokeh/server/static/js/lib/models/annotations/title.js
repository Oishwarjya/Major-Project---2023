var _a;
import { TextAnnotation, TextAnnotationView } from "./text_annotation";
import { VerticalAlign, TextAlign } from "../../core/enums";
export class TitleView extends TextAnnotationView {
    _get_position() {
        const hmargin = this.model.offset;
        const vmargin = this.model.standoff / 2;
        const { align, vertical_align } = this.model;
        let sx, sy;
        const { bbox } = this.layout;
        switch (this.panel.side) {
            case "above":
            case "below": {
                switch (vertical_align) {
                    case "top":
                        sy = bbox.top + vmargin;
                        break;
                    case "middle":
                        sy = bbox.vcenter;
                        break;
                    case "bottom":
                        sy = bbox.bottom - vmargin;
                        break;
                }
                switch (align) {
                    case "left":
                        sx = bbox.left + hmargin;
                        break;
                    case "center":
                        sx = bbox.hcenter;
                        break;
                    case "right":
                        sx = bbox.right - hmargin;
                        break;
                }
                break;
            }
            case "left": {
                switch (vertical_align) {
                    case "top":
                        sx = bbox.left + vmargin;
                        break;
                    case "middle":
                        sx = bbox.hcenter;
                        break;
                    case "bottom":
                        sx = bbox.right - vmargin;
                        break;
                }
                switch (align) {
                    case "left":
                        sy = bbox.bottom - hmargin;
                        break;
                    case "center":
                        sy = bbox.vcenter;
                        break;
                    case "right":
                        sy = bbox.top + hmargin;
                        break;
                }
                break;
            }
            case "right": {
                switch (vertical_align) {
                    case "top":
                        sx = bbox.right - vmargin;
                        break;
                    case "middle":
                        sx = bbox.hcenter;
                        break;
                    case "bottom":
                        sx = bbox.left + vmargin;
                        break;
                }
                switch (align) {
                    case "left":
                        sy = bbox.top + hmargin;
                        break;
                    case "center":
                        sy = bbox.vcenter;
                        break;
                    case "right":
                        sy = bbox.bottom - hmargin;
                        break;
                }
                break;
            }
        }
        const x_anchor = align;
        const y_anchor = vertical_align == "middle" ? "center" : vertical_align;
        return { sx, sy, x_anchor, y_anchor };
    }
    _render() {
        const position = this._get_position();
        const angle = this.panel.get_label_angle_heuristic("parallel");
        this._paint(this.layer.ctx, position, angle);
    }
    _get_size() {
        if (!this.displayed)
            return { width: 0, height: 0 };
        const graphics = this._text_view.graphics();
        graphics.visuals = this.visuals.text.values();
        const { width, height } = graphics._size();
        // XXX: The magic 2px is for backwards compatibility. This will be removed at
        // some point, but currently there is no point breaking half of visual tests.
        return { width, height: height == 0 ? 0 : 2 + height + this.model.standoff };
    }
}
TitleView.__name__ = "TitleView";
export class Title extends TextAnnotation {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Title;
Title.__name__ = "Title";
(() => {
    _a.prototype.default_view = TitleView;
    _a.define(({ Number }) => ({
        vertical_align: [VerticalAlign, "bottom"],
        align: [TextAlign, "left"],
        offset: [Number, 0],
        standoff: [Number, 10],
    }));
    _a.override({
        text_font_size: "13px",
        text_font_style: "bold",
        text_line_height: 1.0,
    });
})();
//# sourceMappingURL=title.js.map