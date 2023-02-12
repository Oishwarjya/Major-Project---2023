var _a;
import { AbstractButton, AbstractButtonView } from "./abstract_button";
import { Tooltip } from "../ui/tooltip";
import { BuiltinIcon } from "../ui/icons/builtin_icon";
import { build_view } from "../../core/build_views";
export class HelpButtonView extends AbstractButtonView {
    *children() {
        yield* super.children();
        yield this.tooltip;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const { tooltip } = this.model;
        this.tooltip = await build_view(tooltip, { parent: this });
    }
    remove() {
        this.tooltip.remove();
        super.remove();
    }
    render() {
        super.render();
        let persistent = false;
        const toggle = (visible) => {
            this.tooltip.model.setv({
                visible,
                closable: persistent,
            });
            //icon_el.style.visibility = visible && persistent ? "visible" : ""
        };
        this.on_change(this.tooltip.model.properties.visible, () => {
            const { visible } = this.tooltip.model;
            if (!visible) {
                persistent = false;
            }
            toggle(visible);
        });
        this.el.addEventListener("mouseenter", () => {
            toggle(true);
        });
        this.el.addEventListener("mouseleave", () => {
            if (!persistent)
                toggle(false);
        });
        document.addEventListener("mousedown", (event) => {
            const path = event.composedPath();
            if (path.includes(this.tooltip.el)) {
                return;
            }
            else if (path.includes(this.el)) {
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
HelpButtonView.__name__ = "HelpButtonView";
export class HelpButton extends AbstractButton {
    constructor(attrs) {
        super(attrs);
    }
}
_a = HelpButton;
HelpButton.__name__ = "HelpButton";
(() => {
    _a.prototype.default_view = HelpButtonView;
    _a.define(({ Ref }) => ({
        tooltip: [Ref(Tooltip)],
    }));
    _a.override({
        label: "",
        icon: new BuiltinIcon({ icon_name: "help", size: 18 }),
        button_type: "default",
    });
})();
//# sourceMappingURL=help_button.js.map