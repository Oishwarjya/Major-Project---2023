var _a;
import * as mixins from "../../core/property_mixins";
import { Signal0 } from "../../core/signaling";
import { Location, OutputBackend, ResetPolicy } from "../../core/enums";
import { concat, remove_by } from "../../core/util/array";
import { difference } from "../../core/util/set";
import { isString } from "../../core/util/types";
import { LayoutDOM } from "../layouts/layout_dom";
import { Axis } from "../axes/axis";
import { Grid } from "../grids/grid";
import { Annotation } from "../annotations/annotation";
import { Title } from "../annotations/title";
import { LinearScale } from "../scales/linear_scale";
import { Toolbar } from "../tools/toolbar";
import { Range } from "../ranges/range";
import { Scale } from "../scales/scale";
import { ColumnDataSource } from "../sources/column_data_source";
import { Renderer } from "../renderers/renderer";
import { DataRenderer } from "../renderers/data_renderer";
import { GlyphRenderer } from "../renderers/glyph_renderer";
import { Tool } from "../tools/tool";
import { DataRange1d } from "../ranges/data_range1d";
import { PlotView } from "./plot_canvas";
export { PlotView };
export class Plot extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
        this.use_map = false;
        this.reset = new Signal0(this, "reset");
    }
    add_layout(renderer, side = "center") {
        const renderers = this.properties[side].get_value();
        this.setv({ [side]: [...renderers, renderer] });
    }
    remove_layout(renderer) {
        const del = (items) => {
            remove_by(items, (item) => item == renderer);
        };
        del(this.left);
        del(this.right);
        del(this.above);
        del(this.below);
        del(this.center);
    }
    get data_renderers() {
        return this.renderers.filter((r) => r instanceof DataRenderer);
    }
    add_renderers(...renderers) {
        this.renderers = [...this.renderers, ...renderers];
    }
    add_glyph(glyph, source = new ColumnDataSource(), attrs = {}) {
        const renderer = new GlyphRenderer({ ...attrs, data_source: source, glyph });
        this.add_renderers(renderer);
        return renderer;
    }
    add_tools(...tools) {
        const computed_tools = tools.map((tool) => tool instanceof Tool ? tool : Tool.from_string(tool));
        this.toolbar.tools = [...this.toolbar.tools, ...computed_tools];
    }
    remove_tools(...tools) {
        this.toolbar.tools = [...difference(new Set(this.toolbar.tools), new Set(tools))];
    }
    get panels() {
        return [...this.side_panels, ...this.center];
    }
    get side_panels() {
        const { above, below, left, right } = this;
        return concat([above, below, left, right]);
    }
}
_a = Plot;
Plot.__name__ = "Plot";
(() => {
    _a.prototype.default_view = PlotView;
    _a.mixins([
        ["outline_", mixins.Line],
        ["background_", mixins.Fill],
        ["border_", mixins.Fill],
    ]);
    _a.define(({ Boolean, Number, String, Array, Dict, Or, Ref, Null, Nullable, Struct, Opt }) => ({
        toolbar: [Ref(Toolbar), () => new Toolbar()],
        toolbar_location: [Nullable(Location), "right"],
        toolbar_sticky: [Boolean, true],
        toolbar_inner: [Boolean, false],
        frame_width: [Nullable(Number), null],
        frame_height: [Nullable(Number), null],
        frame_align: [Or(Boolean, Struct({ left: Opt(Boolean), right: Opt(Boolean), top: Opt(Boolean), bottom: Opt(Boolean) })), true],
        // revise this when https://github.com/microsoft/TypeScript/pull/42425 is merged
        title: [Or(Ref(Title), String, Null), "", {
                convert: (title) => isString(title) ? new Title({ text: title }) : title,
            }],
        title_location: [Nullable(Location), "above"],
        above: [Array(Or(Ref(Annotation), Ref(Axis))), []],
        below: [Array(Or(Ref(Annotation), Ref(Axis))), []],
        left: [Array(Or(Ref(Annotation), Ref(Axis))), []],
        right: [Array(Or(Ref(Annotation), Ref(Axis))), []],
        center: [Array(Or(Ref(Annotation), Ref(Grid))), []],
        renderers: [Array(Ref(Renderer)), []],
        x_range: [Ref(Range), () => new DataRange1d()],
        y_range: [Ref(Range), () => new DataRange1d()],
        x_scale: [Ref(Scale), () => new LinearScale()],
        y_scale: [Ref(Scale), () => new LinearScale()],
        extra_x_ranges: [Dict(Ref(Range)), {}],
        extra_y_ranges: [Dict(Ref(Range)), {}],
        extra_x_scales: [Dict(Ref(Scale)), {}],
        extra_y_scales: [Dict(Ref(Scale)), {}],
        lod_factor: [Number, 10],
        lod_interval: [Number, 300],
        lod_threshold: [Nullable(Number), 2000],
        lod_timeout: [Number, 500],
        hidpi: [Boolean, true],
        output_backend: [OutputBackend, "canvas"],
        min_border: [Nullable(Number), 5],
        min_border_top: [Nullable(Number), null],
        min_border_left: [Nullable(Number), null],
        min_border_bottom: [Nullable(Number), null],
        min_border_right: [Nullable(Number), null],
        inner_width: [Number, 0],
        inner_height: [Number, 0],
        outer_width: [Number, 0],
        outer_height: [Number, 0],
        match_aspect: [Boolean, false],
        aspect_scale: [Number, 1],
        reset_policy: [ResetPolicy, "standard"],
        hold_render: [Boolean, false],
    }));
    _a.override({
        width: 600,
        height: 600,
        outline_line_color: "#e5e5e5",
        border_fill_color: "#ffffff",
        background_fill_color: "#ffffff",
    });
})();
//# sourceMappingURL=plot.js.map