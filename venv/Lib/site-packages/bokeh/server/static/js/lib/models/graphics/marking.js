var _a;
import { Model } from "../../model";
import { View } from "../../core/view";
import * as visuals from "../../core/visuals";
import * as p from "../../core/properties";
export class MarkingView extends View {
    initialize() {
        super.initialize();
        this.visuals = new visuals.Visuals(this);
    }
    request_render() {
        this.parent.request_render();
    }
    get canvas() {
        return this.parent.canvas;
    }
    set_data(source, indices) {
        const self = this;
        for (const prop of this.model) {
            if (!(prop instanceof p.VectorSpec || prop instanceof p.ScalarSpec))
                continue;
            const uniform = prop.uniform(source).select(indices);
            self[`${prop.attr}`] = uniform;
        }
    }
}
MarkingView.__name__ = "MarkingView";
export class Marking extends Model {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Marking;
Marking.__name__ = "Marking";
(() => {
    _a.define(({}) => ({}));
})();
//# sourceMappingURL=marking.js.map