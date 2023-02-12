var _a;
import { Action, ActionView } from "./action";
import { RendererGroup } from "../renderers/renderer";
import { enumerate } from "../../core/util/iterator";
export class ToggleGroupView extends ActionView {
    update(_source, i, _vars /*, formatters?: Formatters*/) {
        for (const [group, j] of enumerate(this.model.groups)) {
            group.visible = i == j;
        }
    }
}
ToggleGroupView.__name__ = "ToggleGroupView";
export class ToggleGroup extends Action {
    constructor(attrs) {
        super(attrs);
    }
}
_a = ToggleGroup;
ToggleGroup.__name__ = "ToggleGroup";
(() => {
    _a.prototype.default_view = ToggleGroupView;
    _a.define(({ Array, Ref }) => ({
        groups: [Array(Ref(RendererGroup)), []],
    }));
})();
//# sourceMappingURL=toggle_group.js.map