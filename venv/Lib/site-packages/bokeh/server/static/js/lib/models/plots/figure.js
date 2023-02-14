var _a;
import { Plot, PlotView } from "./plot";
export class FigureView extends PlotView {
    // TODO: remove this before bokeh 3.0 and update *.blf files
    serializable_state() {
        const state = super.serializable_state();
        return { ...state, type: "Plot" };
    }
}
FigureView.__name__ = "FigureView";
export class Figure extends Plot {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Figure;
Figure.__name__ = "Figure";
(() => {
    _a.prototype.default_view = FigureView;
})();
//# sourceMappingURL=figure.js.map