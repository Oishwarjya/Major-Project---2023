var _a;
import { InspectTool, InspectToolView } from "./inspect_tool";
import { Span } from "../../annotations/span";
import { Dimensions } from "../../../core/enums";
import { isArray } from "../../../core/util/types";
import { tool_icon_crosshair } from "../../../styles/icons.css";
export class CrosshairToolView extends InspectToolView {
    get overlays() {
        return [...super.overlays, ...this._spans];
    }
    initialize() {
        super.initialize();
        this._update_overlays();
    }
    connect_signals() {
        super.connect_signals();
        const { overlay, dimensions, line_color, line_width, line_alpha } = this.model.properties;
        this.on_change([overlay, dimensions, line_color, line_width, line_alpha], () => {
            this._update_overlays();
            // TODO: notify change
        });
    }
    _update_overlays() {
        const { overlay } = this.model;
        if (overlay == "auto") {
            const { dimensions, line_color, line_alpha, line_width } = this.model;
            function span(dimension) {
                return new Span({
                    dimension,
                    location_units: "canvas",
                    level: "overlay",
                    line_color,
                    line_width,
                    line_alpha,
                });
            }
            switch (dimensions) {
                case "width": {
                    this._spans = [span("width")];
                    break;
                }
                case "height": {
                    this._spans = [span("height")];
                    break;
                }
                case "both": {
                    this._spans = [span("width"), span("height")];
                    break;
                }
            }
        }
        else if (isArray(overlay)) {
            this._spans = [...overlay];
        }
        else {
            this._spans = [overlay];
        }
    }
    _move(ev) {
        if (!this.model.active)
            return;
        const { sx, sy } = ev;
        if (!this.plot_view.frame.bbox.contains(sx, sy))
            this._update_spans(NaN, NaN);
        else
            this._update_spans(sx, sy);
    }
    _move_exit(_e) {
        this._update_spans(NaN, NaN);
    }
    _update_spans(sx, sy) {
        const { frame } = this.plot_view;
        function invert(span, sx, sy) {
            const { dimension } = span;
            switch (span.location_units) {
                case "canvas": {
                    return dimension == "width" ? sy : sx;
                }
                case "screen": {
                    const { xview, yview } = frame.bbox;
                    return dimension == "width" ? yview.invert(sy) : xview.invert(sx);
                }
                case "data": {
                    const { x_scale, y_scale } = frame;
                    return dimension == "width" ? y_scale.invert(sy) : x_scale.invert(sx);
                }
            }
        }
        for (const span of this._spans) {
            span.location = invert(span, sx, sy);
        }
    }
}
CrosshairToolView.__name__ = "CrosshairToolView";
export class CrosshairTool extends InspectTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Crosshair";
        this.tool_icon = tool_icon_crosshair;
    }
    get tooltip() {
        return this._get_dim_tooltip(this.dimensions);
    }
}
_a = CrosshairTool;
CrosshairTool.__name__ = "CrosshairTool";
(() => {
    _a.prototype.default_view = CrosshairToolView;
    _a.define(({ Alpha, Number, Color, Auto, Tuple, Ref, Or }) => ({
        overlay: [Or(Auto, Ref(Span), Tuple(Ref(Span), Ref(Span))), "auto"],
        dimensions: [Dimensions, "both"],
        line_color: [Color, "black"],
        line_width: [Number, 1],
        line_alpha: [Alpha, 1],
    }));
    _a.register_alias("crosshair", () => new CrosshairTool());
})();
//# sourceMappingURL=crosshair_tool.js.map