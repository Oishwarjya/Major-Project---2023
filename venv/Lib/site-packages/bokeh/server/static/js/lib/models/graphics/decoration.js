var _a;
import { Marking } from "./marking";
import { Model } from "../../model";
import { View } from "../../core/view";
import { build_view } from "../../core/build_views";
export class DecorationView extends View {
    *children() {
        yield* super.children();
        yield this.marking;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        this.marking = await build_view(this.model.marking, { parent: this.parent });
    }
}
DecorationView.__name__ = "DecorationView";
export class Decoration extends Model {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Decoration;
Decoration.__name__ = "Decoration";
(() => {
    _a.prototype.default_view = DecorationView;
    _a.define(({ Enum, Ref }) => ({
        marking: [Ref(Marking)],
        node: [Enum("start", "middle", "end")],
    }));
})();
//# sourceMappingURL=decoration.js.map