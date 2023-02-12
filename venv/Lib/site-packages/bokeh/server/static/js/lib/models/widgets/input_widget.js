var _a;
import { Control, ControlView } from "./control";
import { Tooltip } from "../ui/tooltip";
import { assert } from "../../core/util/assert";
import { isString } from "../../core/util/types";
import { build_view } from "../../core/build_views";
import { div, label } from "../../core/dom";
import inputs_css, * as inputs from "../../styles/widgets/inputs.css";
import icons_css from "../../styles/icons.css";
export class InputWidgetView extends ControlView {
    constructor() {
        super(...arguments);
        this.description = null;
        this.desc_el = null;
    }
    *controls() {
        yield this.input_el;
    }
    *children() {
        yield* super.children();
        if (this.description != null)
            yield this.description;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const { description } = this.model;
        if (description instanceof Tooltip) {
            this.description = await build_view(description, { parent: this });
        }
    }
    remove() {
        this.description?.remove();
        super.remove();
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.title.change, () => {
            this.label_el.textContent = this.model.title;
        });
    }
    styles() {
        return [...super.styles(), inputs_css, icons_css];
    }
    render() {
        super.render();
        const { title, description } = this.model;
        if (description == null)
            this.desc_el = null;
        else {
            const icon_el = div({ class: inputs.icon });
            this.desc_el = div({ class: inputs.description }, icon_el);
            if (isString(description))
                this.desc_el.title = description;
            else {
                const { description } = this;
                assert(description != null);
                const { desc_el } = this;
                description.model.target = desc_el;
                let persistent = false;
                const toggle = (visible) => {
                    description.model.setv({
                        visible,
                        closable: persistent,
                    });
                    icon_el.classList.toggle(inputs.opaque, visible && persistent);
                };
                this.on_change(description.model.properties.visible, () => {
                    const { visible } = description.model;
                    if (!visible) {
                        persistent = false;
                    }
                    toggle(visible);
                });
                desc_el.addEventListener("mouseenter", () => {
                    toggle(true);
                });
                desc_el.addEventListener("mouseleave", () => {
                    if (!persistent)
                        toggle(false);
                });
                document.addEventListener("mousedown", (event) => {
                    const path = event.composedPath();
                    if (path.includes(description.el)) {
                        return;
                    }
                    else if (path.includes(desc_el)) {
                        persistent = !persistent;
                        toggle(persistent);
                    }
                    else {
                        persistent = false;
                        toggle(false);
                    }
                });
                window.addEventListener("blur", () => {
                    persistent = false;
                    toggle(false);
                });
            }
        }
        this.label_el = label({ style: { display: title.length == 0 ? "none" : "" } }, title, this.desc_el);
        this.group_el = div({ class: inputs.input_group }, this.label_el);
        this.shadow_el.appendChild(this.group_el);
    }
    change_input() { }
}
InputWidgetView.__name__ = "InputWidgetView";
export class InputWidget extends Control {
    constructor(attrs) {
        super(attrs);
    }
}
_a = InputWidget;
InputWidget.__name__ = "InputWidget";
(() => {
    _a.define(({ String, Nullable, Or, Ref }) => ({
        title: [String, ""],
        description: [Nullable(Or(String, Ref(Tooltip))), null],
    }));
})();
//# sourceMappingURL=input_widget.js.map