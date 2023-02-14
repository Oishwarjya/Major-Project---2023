var _a;
import { GMapPlot, GMapPlotView } from "./gmap_plot";
export class GMapView extends GMapPlotView {
    // TODO: remove this before bokeh 3.0 and update *.blf files
    serializable_state() {
        const state = super.serializable_state();
        return { ...state, type: "GMapPlot" };
    }
}
GMapView.__name__ = "GMapView";
export class GMap extends GMapPlot {
    constructor(attrs) {
        super(attrs);
    }
}
_a = GMap;
GMap.__name__ = "GMap";
(() => {
    _a.prototype.default_view = GMapView;
})();
//# sourceMappingURL=gmap.js.map