import { HasProps } from "../core/has_props";
import { entries } from "../core/util/object";
class ThemedAttrs {
    constructor(type, attrs) {
        this.type = type;
        this.attrs = attrs;
        this.defaults = new Map(entries(attrs));
    }
}
ThemedAttrs.__name__ = "ThemedAttrs";
function themed(type, attrs) {
    return new ThemedAttrs(type, attrs);
}
class Theme {
    constructor(attrs) {
        this.attrs = attrs;
    }
    get(obj, attr) {
        const model = obj instanceof HasProps ? obj.constructor : obj;
        for (const { type, defaults } of this.attrs) {
            if (model == type || model.prototype instanceof type)
                return defaults.get(attr);
        }
        return undefined;
    }
}
Theme.__name__ = "Theme";
import { Plot, Grid, Axis, Legend, BaseColorBar, Title } from "./models";
export const dark_minimal = new Theme([
    themed(Plot, {
        background_fill_color: "#20262b",
        border_fill_color: "#15191c",
        outline_line_color: "#e0e0e0",
        outline_line_alpha: 0.25,
    }),
    themed(Grid, {
        grid_line_color: "#e0e0e0",
        grid_line_alpha: 0.25,
    }),
    themed(Axis, {
        major_tick_line_alpha: 0,
        major_tick_line_color: "#e0e0e0",
        minor_tick_line_alpha: 0,
        minor_tick_line_color: "#e0e0e0",
        axis_line_alpha: 0,
        axis_line_color: "#e0e0e0",
        major_label_text_color: "#e0e0e0",
        major_label_text_font: "Helvetica",
        major_label_text_font_size: "1.025em",
        axis_label_standoff: 10,
        axis_label_text_color: "#e0e0e0",
        axis_label_text_font: "Helvetica",
        axis_label_text_font_size: "1.25em",
        axis_label_text_font_style: "normal",
    }),
    themed(Legend, {
        spacing: 8,
        glyph_width: 15,
        label_standoff: 8,
        label_text_color: "#e0e0e0",
        label_text_font: "Helvetica",
        label_text_font_size: "1.025em",
        border_line_alpha: 0,
        background_fill_alpha: 0.25,
        background_fill_color: "#20262b",
    }),
    themed(BaseColorBar, {
        title_text_color: "#e0e0e0",
        title_text_font: "Helvetica",
        title_text_font_size: "1.025em",
        title_text_font_style: "normal",
        major_label_text_color: "#e0e0e0",
        major_label_text_font: "Helvetica",
        major_label_text_font_size: "1.025em",
        background_fill_color: "#15191c",
        major_tick_line_alpha: 0,
        bar_line_alpha: 0,
    }),
    themed(Title, {
        text_color: "#e0e0e0",
        text_font: "Helvetica",
        text_font_size: "1.15em",
    }),
]);
export const light_minimal = new Theme([
    themed(Axis, {
        major_tick_line_alpha: 0,
        major_tick_line_color: "#5b5b5b",
        minor_tick_line_alpha: 0,
        minor_tick_line_color: "#5b5b5b",
        axis_line_alpha: 0,
        axis_line_color: "#5b5b5b",
        major_label_text_color: "#5b5b5b",
        major_label_text_font: "Helvetica",
        major_label_text_font_size: "1.025em",
        axis_label_standoff: 10,
        axis_label_text_color: "#5b5b5b",
        axis_label_text_font: "Helvetica",
        axis_label_text_font_size: "1.25em",
        axis_label_text_font_style: "normal",
    }),
    themed(Legend, {
        spacing: 8,
        glyph_width: 15,
        label_standoff: 8,
        label_text_color: "#5b5b5b",
        label_text_font: "Helvetica",
        label_text_font_size: "1.025em",
        border_line_alpha: 0,
        background_fill_alpha: 0.25,
    }),
    themed(BaseColorBar, {
        title_text_color: "#5b5b5b",
        title_text_font: "Helvetica",
        title_text_font_size: "1.025em",
        title_text_font_style: "normal",
        major_label_text_color: "#5b5b5b",
        major_label_text_font: "Helvetica",
        major_label_text_font_size: "1.025em",
        major_tick_line_alpha: 0,
        bar_line_alpha: 0,
    }),
    themed(Title, {
        text_color: "#5b5b5b",
        text_font: "Helvetica",
        text_font_size: "1.15em",
    }),
]);
export const caliber = new Theme([
    themed(Axis, {
        major_tick_in: 0,
        major_tick_out: 3,
        major_tick_line_alpha: 0.25,
        major_tick_line_color: "#5b5b5b",
        minor_tick_line_alpha: 0.25,
        minor_tick_line_color: "#5b5b5b",
        axis_line_alpha: 1,
        axis_line_color: "#5b5b5b",
        major_label_text_color: "#5b5b5b",
        major_label_text_font: "Calibri Light",
        major_label_text_font_size: "0.95em",
        major_label_text_font_style: "bold",
        axis_label_standoff: 10,
        axis_label_text_color: "#5b5b5b",
        axis_label_text_font: "Calibri Light",
        axis_label_text_font_size: "1.15em",
        axis_label_text_font_style: "bold",
    }),
    themed(Legend, {
        spacing: 8,
        glyph_width: 15,
        label_standoff: 8,
        label_text_color: "#5b5b5b",
        label_text_font: "Calibri Light",
        label_text_font_size: "0.95em",
        label_text_font_style: "bold",
        border_line_alpha: 0,
        background_fill_alpha: 0.25,
    }),
    themed(BaseColorBar, {
        title_text_color: "#5b5b5b",
        title_text_font: "Calibri Light",
        title_text_font_size: "1.15em",
        title_text_font_style: "bold",
        major_label_text_color: "#5b5b5b",
        major_label_text_font: "Calibri Light",
        major_label_text_font_size: "0.95em",
        major_label_text_font_style: "bold",
        major_tick_line_alpha: 0,
        bar_line_alpha: 0,
    }),
    themed(Title, {
        text_color: "#5b5b5b",
        text_font: "Calibri Light",
        text_font_size: "1.25em",
        text_font_style: "bold",
    }),
]);
export const constrast = new Theme([
    themed(Plot, {
        background_fill_color: "#000000",
        border_fill_color: "#ffffff",
        outline_line_color: "#000000",
        outline_line_alpha: 0.25,
    }),
    themed(Grid, {
        grid_line_color: "#e0e0e0",
        grid_line_alpha: 0.25,
    }),
    themed(Axis, {
        major_tick_line_alpha: 0,
        major_tick_line_color: "#000000",
        minor_tick_line_alpha: 0,
        minor_tick_line_color: "#000000",
        axis_line_alpha: 0,
        axis_line_color: "#000000",
        major_label_text_color: "#000000",
        major_label_text_font: "Helvetica",
        major_label_text_font_size: "1.025em",
        axis_label_standoff: 10,
        axis_label_text_color: "#000000",
        axis_label_text_font: "Helvetica",
        axis_label_text_font_size: "1.25em",
        axis_label_text_font_style: "normal",
    }),
    themed(Legend, {
        spacing: 8,
        glyph_width: 15,
        label_standoff: 8,
        label_text_color: "#ffffff",
        label_text_font: "Helvetica",
        label_text_font_size: "1.025em",
        border_line_alpha: 0,
        background_fill_alpha: 0.25,
        background_fill_color: "#000000",
    }),
    themed(BaseColorBar, {
        title_text_color: "#e0e0e0",
        title_text_font: "Helvetica",
        title_text_font_size: "1.025em",
        title_text_font_style: "normal",
        major_label_text_color: "#e0e0e0",
        major_label_text_font: "Helvetica",
        major_label_text_font_size: "1.025em",
        background_fill_color: "#15191c",
        major_tick_line_alpha: 0,
        bar_line_alpha: 0,
    }),
    themed(Title, {
        text_color: "#000000",
        text_font: "Helvetica",
        text_font_size: "1.15em",
    }),
]);
export const night_sky = new Theme([
    themed(Plot, {
        background_fill_color: "#2C001e",
        border_fill_color: "#15191c",
        outline_line_color: "#e0e0e0",
        outline_line_alpha: 0.25,
    }),
    themed(Grid, {
        grid_line_color: "#e0e0e0",
        grid_line_alpha: 0.25,
    }),
    themed(Axis, {
        major_tick_line_alpha: 0,
        major_tick_line_color: "#e0e0e0",
        minor_tick_line_alpha: 0,
        minor_tick_line_color: "#e0e0e0",
        axis_line_alpha: 0,
        axis_line_color: "#e0e0e0",
        major_label_text_color: "#e0e0e0",
        major_label_text_font: "Helvetica",
        major_label_text_font_size: "1.025em",
        axis_label_standoff: 10,
        axis_label_text_color: "#e0e0e0",
        axis_label_text_font: "Helvetica",
        axis_label_text_font_size: "1.25em",
        axis_label_text_font_style: "normal",
    }),
    themed(Legend, {
        spacing: 8,
        glyph_width: 15,
        label_standoff: 8,
        label_text_color: "#e0e0e0",
        label_text_font: "Helvetica",
        label_text_font_size: "1.025em",
        border_line_alpha: 0,
        background_fill_alpha: 0.25,
        background_fill_color: "#2C001e",
    }),
    themed(BaseColorBar, {
        title_text_color: "#e0e0e0",
        title_text_font: "Helvetica",
        title_text_font_size: "1.025em",
        title_text_font_style: "normal",
        major_label_text_color: "#e0e0e0",
        major_label_text_font: "Helvetica",
        major_label_text_font_size: "1.025em",
        background_fill_color: "#15191c",
        major_tick_line_alpha: 0,
        bar_line_alpha: 0,
    }),
    themed(Title, {
        text_color: "#e0e0e0",
        text_font: "Helvetica",
        text_font_size: "1.15em",
    }),
]);
//# sourceMappingURL=themes.js.map