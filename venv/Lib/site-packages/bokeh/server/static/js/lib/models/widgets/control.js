import { Widget, WidgetView } from "./widget";
import { toggle_attribute } from "../../core/dom";
export class ControlView extends WidgetView {
    connect_signals() {
        super.connect_signals();
        this.connect(this.disabled, (disabled) => {
            for (const el of this.controls()) {
                toggle_attribute(el, "disabled", disabled);
            }
        });
    }
}
ControlView.__name__ = "ControlView";
export class Control extends Widget {
    constructor(attrs) {
        super(attrs);
    }
}
Control.__name__ = "Control";
//# sourceMappingURL=control.js.map