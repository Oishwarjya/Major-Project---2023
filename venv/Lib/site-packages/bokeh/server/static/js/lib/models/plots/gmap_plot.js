var _a, _b, _c;
import { Plot } from "./plot";
import { MapType } from "../../core/enums";
import { Model } from "../../model";
import { Range1d } from "../ranges/range1d";
import { GMapPlotView } from "./gmap_plot_canvas";
export { GMapPlotView };
export class MapOptions extends Model {
    constructor(attrs) {
        super(attrs);
    }
}
_a = MapOptions;
MapOptions.__name__ = "MapOptions";
(() => {
    _a.define(({ Int, Number }) => ({
        lat: [Number],
        lng: [Number],
        zoom: [Int, 12],
    }));
})();
export class GMapOptions extends MapOptions {
    constructor(attrs) {
        super(attrs);
    }
}
_b = GMapOptions;
GMapOptions.__name__ = "GMapOptions";
(() => {
    _b.define(({ Boolean, Int, String, Nullable }) => ({
        map_type: [MapType, "roadmap"],
        scale_control: [Boolean, false],
        styles: [Nullable(String), null],
        tilt: [Int, 45],
    }));
})();
export class GMapPlot extends Plot {
    constructor(attrs) {
        super(attrs);
        this.use_map = true;
    }
}
_c = GMapPlot;
GMapPlot.__name__ = "GMapPlot";
(() => {
    _c.prototype.default_view = GMapPlotView;
    _c.define(({ String, Bytes, Ref }) => ({
        map_options: [Ref(GMapOptions)],
        api_key: [Bytes],
        api_version: [String, "weekly"],
    }));
    _c.override({
        x_range: () => new Range1d(),
        y_range: () => new Range1d(),
        background_fill_alpha: 0.0,
    });
})();
//# sourceMappingURL=gmap_plot.js.map