var _a, _b, _c;
import { isNumber } from "../../core/util/types";
import { load_image } from "../../core/util/image";
import { color2css, color2hexrgb, color2rgba } from "../../core/util/color";
import { text_width } from "../../core/graphics";
import { font_metrics, parse_css_font_size, parse_css_length } from "../../core/util/text";
import { insert_text_on_position } from "../../core/util/string";
import { AffineTransform } from "../../core/util/affine";
import { BBox } from "../../core/util/bbox";
import { BaseText, BaseTextView } from "./base_text";
import { default_provider } from "./providers";
/**
 * Helper class for rendering MathText into Canvas
 */
export class MathTextView extends BaseTextView {
    constructor() {
        super(...arguments);
        this._position = { sx: 0, sy: 0 };
        // Align does nothing, needed to maintain compatibility with TextBox,
        // to align you need to use TeX Macros.
        // http://docs.mathjax.org/en/latest/input/tex/macros/index.html?highlight=align
        this.align = "left";
        this._x_anchor = "left";
        this._y_anchor = "center";
        this._base_font_size = 13; // the same as :host's font-size (13px)
        this.font_size_scale = 1.0;
        this.svg_image = null;
    }
    graphics() {
        return this;
    }
    // Same for infer_text_height
    infer_text_height() {
        return "ascent_descent";
    }
    set base_font_size(v) {
        if (v != null)
            this._base_font_size = v;
    }
    get base_font_size() {
        return this._base_font_size;
    }
    _rect() {
        const { width, height } = this._size();
        const { x, y } = this._computed_position();
        const bbox = new BBox({ x, y, width, height });
        return bbox.rect;
    }
    set position(p) {
        this._position = p;
    }
    get position() {
        return this._position;
    }
    get text() {
        return this.model.text;
    }
    get provider() {
        return default_provider;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        if (this.provider.status == "not_started")
            await this.provider.fetch();
    }
    connect_signals() {
        super.connect_signals();
        this.on_change(this.model.properties.text, () => this.load_image());
    }
    set visuals(v) {
        const color = v.color;
        const alpha = v.alpha;
        const style = v.font_style;
        let size = v.font_size;
        const face = v.font;
        const { font_size_scale, _base_font_size } = this;
        const res = parse_css_font_size(size);
        if (res != null) {
            let { value, unit } = res;
            value *= font_size_scale;
            if (unit == "em" && _base_font_size) {
                value *= _base_font_size;
                unit = "px";
            }
            size = `${value}${unit}`;
        }
        const font = `${style} ${size} ${face}`;
        this.font = font;
        this.color = color2css(color, alpha);
        const align = v.align;
        //this._visual_align = align
        this._x_anchor = align;
        const baseline = v.baseline;
        this._y_anchor = (() => {
            switch (baseline) {
                case "top": return "top";
                case "middle": return "center";
                case "bottom": return "bottom";
                default: return "baseline";
            }
        })();
    }
    /**
     * Calculates position of element after considering
     * anchor and dimensions
     */
    _computed_position() {
        const { width, height } = this._size();
        const { sx, sy, x_anchor = this._x_anchor, y_anchor = this._y_anchor } = this.position;
        const metrics = font_metrics(this.font);
        const x = sx - (() => {
            if (isNumber(x_anchor))
                return x_anchor * width;
            else {
                switch (x_anchor) {
                    case "left": return 0;
                    case "center": return 0.5 * width;
                    case "right": return width;
                }
            }
        })();
        const y = sy - (() => {
            if (isNumber(y_anchor))
                return y_anchor * height;
            else {
                switch (y_anchor) {
                    case "top":
                        if (metrics.height > height)
                            return (height - (-this.valign - metrics.descent) - metrics.height);
                        else
                            return 0;
                    case "center": return 0.5 * height;
                    case "bottom":
                        if (metrics.height > height)
                            return (height + metrics.descent + this.valign);
                        else
                            return height;
                    case "baseline": return 0.5 * height;
                }
            }
        })();
        return { x, y };
    }
    /**
     * Uses the width, height and given angle to calculate the size
    */
    size() {
        const { width, height } = this._size();
        const { angle } = this;
        if (angle == null || angle == 0)
            return { width, height };
        else {
            const c = Math.cos(Math.abs(angle));
            const s = Math.sin(Math.abs(angle));
            return {
                width: Math.abs(width * c + height * s),
                height: Math.abs(width * s + height * c),
            };
        }
    }
    get_image_dimensions() {
        const fmetrics = font_metrics(this.font);
        // XXX: perhaps use getComputedStyle()?
        const svg_styles = this.svg_element.getAttribute("style")?.split(";");
        if (svg_styles) {
            const rules_map = new Map();
            svg_styles.forEach(property => {
                const [rule, value] = property.split(":");
                if (rule)
                    rules_map.set(rule.trim(), value.trim());
            });
            const v_align = parse_css_length(rules_map.get("vertical-align"));
            if (v_align?.unit == "ex") {
                this.valign = v_align.value * fmetrics.x_height;
            }
            else if (v_align?.unit == "px") {
                this.valign = v_align.value;
            }
        }
        const ex = (() => {
            const width = this.svg_element.getAttribute("width");
            const height = this.svg_element.getAttribute("height");
            return {
                width: width != null && width.endsWith("ex") ? parseFloat(width) : 1,
                height: height != null && height.endsWith("ex") ? parseFloat(height) : 1,
            };
        })();
        return {
            width: fmetrics.x_height * ex.width,
            height: fmetrics.x_height * ex.height,
        };
    }
    get truncated_text() {
        return this.model.text.length > 6
            ? `${this.model.text.substring(0, 6)}...`
            : this.model.text;
    }
    _size() {
        if (!this.svg_image) {
            if (this.provider.status == "failed" || this.provider.status == "not_started") {
                return {
                    width: text_width(this.truncated_text, this.font),
                    height: font_metrics(this.font).height,
                };
            }
            else {
                return { width: this._base_font_size, height: this._base_font_size };
            }
        }
        const fmetrics = font_metrics(this.font);
        let { width, height } = this.get_image_dimensions();
        height = Math.max(height, fmetrics.height);
        const w_scale = this.width?.unit == "%" ? this.width.value : 1;
        const h_scale = this.height?.unit == "%" ? this.height.value : 1;
        return { width: width * w_scale, height: height * h_scale };
    }
    bbox() {
        const { p0, p1, p2, p3 } = this.rect();
        const left = Math.min(p0.x, p1.x, p2.x, p3.x);
        const top = Math.min(p0.y, p1.y, p2.y, p3.y);
        const right = Math.max(p0.x, p1.x, p2.x, p3.x);
        const bottom = Math.max(p0.y, p1.y, p2.y, p3.y);
        return new BBox({ left, right, top, bottom });
    }
    rect() {
        const rect = this._rect();
        const { angle } = this;
        if (angle == null || angle == 0)
            return rect;
        else {
            const { sx, sy } = this.position;
            const tr = new AffineTransform();
            tr.translate(sx, sy);
            tr.rotate(angle);
            tr.translate(-sx, -sy);
            return tr.apply_rect(rect);
        }
    }
    paint_rect(ctx) {
        const { p0, p1, p2, p3 } = this.rect();
        ctx.save();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const { round } = Math;
        ctx.moveTo(round(p0.x), round(p0.y));
        ctx.lineTo(round(p1.x), round(p1.y));
        ctx.lineTo(round(p2.x), round(p2.y));
        ctx.lineTo(round(p3.x), round(p3.y));
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    paint_bbox(ctx) {
        const { x, y, width, height } = this.bbox();
        ctx.save();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const { round } = Math;
        ctx.moveTo(round(x), round(y));
        ctx.lineTo(round(x), round(y + height));
        ctx.lineTo(round(x + width), round(y + height));
        ctx.lineTo(round(x + width), round(y));
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    }
    async load_image() {
        if (this.provider.MathJax == null)
            return null;
        const mathjax_element = this._process_text();
        if (mathjax_element == null) {
            this._has_finished = true;
            return null;
        }
        const svg_element = mathjax_element.children[0];
        this.svg_element = svg_element;
        svg_element.setAttribute("font", this.font);
        svg_element.setAttribute("stroke", this.color);
        const svg = svg_element.outerHTML;
        const src = `data:image/svg+xml;utf-8,${encodeURIComponent(svg)}`;
        this.svg_image = await load_image(src);
        this.parent.request_layout();
        return this.svg_image;
    }
    /**
     * Takes a Canvas' Context2d and if the image has already
     * been loaded draws the image in it otherwise draws the model's text.
    */
    paint(ctx) {
        if (!this.svg_image) {
            if (this.provider.status == "not_started" || this.provider.status == "loading")
                this.provider.ready.connect(() => this.load_image());
            if (this.provider.status == "loaded")
                this.load_image();
        }
        ctx.save();
        const { sx, sy } = this.position;
        const { angle } = this;
        if (angle != null && angle != 0) {
            ctx.translate(sx, sy);
            ctx.rotate(angle);
            ctx.translate(-sx, -sy);
        }
        const { x, y } = this._computed_position();
        if (this.svg_image) {
            const { width, height } = this.get_image_dimensions();
            ctx.drawImage(this.svg_image, x, y, width, height);
        }
        else if (this.provider.status == "failed" || this.provider.status == "not_started") {
            ctx.fillStyle = this.color;
            ctx.font = this.font;
            ctx.textAlign = "left";
            ctx.textBaseline = "alphabetic";
            ctx.fillText(this.truncated_text, x, y + font_metrics(this.font).ascent);
        }
        ctx.restore();
        if (!this._has_finished && (this.provider.status == "failed" || this.svg_image)) {
            this._has_finished = true;
            this.parent.notify_finished_after_paint();
        }
    }
}
MathTextView.__name__ = "MathTextView";
export class MathText extends BaseText {
    constructor(attrs) {
        super(attrs);
    }
}
MathText.__name__ = "MathText";
export class AsciiView extends MathTextView {
    // TODO: Color ascii
    get styled_text() {
        return this.text;
    }
    _process_text() {
        return undefined; // TODO: this.provider.MathJax?.ascii2svg(text)
    }
    _size() {
        return {
            width: text_width(this.text, this.font),
            height: font_metrics(this.font).height,
        };
    }
    paint(ctx) {
        ctx.save();
        const { sx, sy } = this.position;
        const { angle } = this;
        if (angle != null && angle != 0) {
            ctx.translate(sx, sy);
            ctx.rotate(angle);
            ctx.translate(-sx, -sy);
        }
        const { x, y } = this._computed_position();
        ctx.fillStyle = this.color;
        ctx.font = this.font;
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
        ctx.fillText(this.text, x, y + font_metrics(this.font).ascent);
        ctx.restore();
        this._has_finished = true;
        this.parent.notify_finished_after_paint();
    }
}
AsciiView.__name__ = "AsciiView";
export class Ascii extends MathText {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Ascii;
Ascii.__name__ = "Ascii";
(() => {
    _a.prototype.default_view = AsciiView;
})();
export class MathMLView extends MathTextView {
    get styled_text() {
        let styled = this.text.trim();
        let matchs = styled.match(/<math(.*?[^?])?>/s);
        if (!matchs)
            return this.text.trim();
        styled = insert_text_on_position(styled, styled.indexOf(matchs[0]) + matchs[0].length, `<mstyle displaystyle="true" mathcolor="${color2hexrgb(this.color)}" ${this.font.includes("bold") ? 'mathvariant="bold"' : ""}>`);
        matchs = styled.match(/<\/[^>]*?math.*?>/s);
        if (!matchs)
            return this.text.trim();
        return insert_text_on_position(styled, styled.indexOf(matchs[0]), "</mstyle>");
    }
    _process_text() {
        const fmetrics = font_metrics(this.font);
        return this.provider.MathJax?.mathml2svg(this.styled_text, {
            em: this.base_font_size,
            ex: fmetrics.x_height,
        });
    }
}
MathMLView.__name__ = "MathMLView";
export class MathML extends MathText {
    constructor(attrs) {
        super(attrs);
    }
}
_b = MathML;
MathML.__name__ = "MathML";
(() => {
    _b.prototype.default_view = MathMLView;
})();
export class TeXView extends MathTextView {
    get styled_text() {
        const [r, g, b] = color2rgba(this.color);
        return `\\color[RGB]{${r}, ${g}, ${b}} ${this.font.includes("bold") ? `\\pmb{${this.text}}` : this.text}`;
    }
    _process_text() {
        // TODO: allow plot/document level configuration of macros
        const fmetrics = font_metrics(this.font);
        return this.provider.MathJax?.tex2svg(this.styled_text, {
            display: !this.model.inline,
            em: this.base_font_size,
            ex: fmetrics.x_height,
        }, this.model.macros);
    }
}
TeXView.__name__ = "TeXView";
export class TeX extends MathText {
    constructor(attrs) {
        super(attrs);
    }
}
_c = TeX;
TeX.__name__ = "TeX";
(() => {
    _c.prototype.default_view = TeXView;
    _c.define(({ Boolean, Number, String, Dict, Tuple, Or }) => ({
        macros: [Dict(Or(String, Tuple(String, Number))), {}],
        inline: [Boolean, false],
    }));
})();
//# sourceMappingURL=math_text.js.map