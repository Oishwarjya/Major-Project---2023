var _a;
import { UIElement, UIElementView } from "../ui/ui_element";
import { Tool } from "./tool";
import { ToolProxy } from "./tool_proxy";
import { div, MouseButton } from "../../core/dom";
import { ToolIcon } from "../../core/enums";
import { ContextMenu } from "../../core/util/menus";
import { reversed } from "../../core/util/array";
import tool_button_css, * as tool_button from "../../styles/tool_button.css";
import icons_css from "../../styles/icons.css";
export class ToolButtonView extends UIElementView {
    initialize() {
        super.initialize();
        const { location } = this.parent.model;
        const reverse = location == "left" || location == "above";
        const orientation = this.parent.model.horizontal ? "vertical" : "horizontal";
        const items = this.model.tool.menu ?? [];
        this._menu = new ContextMenu(!reverse ? items : reversed(items), {
            target: this.root.el,
            orientation,
            prevent_hide: (event) => event.composedPath().includes(this.el),
        });
        let start = null;
        this.el.addEventListener("pointerdown", (e) => {
            if (e.buttons == MouseButton.Left) {
                start = e.timeStamp;
            }
        });
        this.el.addEventListener("pointerup", (e) => {
            if (start != null) {
                const end = e.timeStamp;
                if (end - start >= 250 /*ms*/) {
                    this._pressed();
                }
                else {
                    if (this._menu.is_open) {
                        this._menu.hide();
                        return;
                    }
                    if (e.composedPath().includes(this.el)) {
                        this._clicked();
                    }
                }
                start = null;
            }
        });
        this.el.addEventListener("keydown", (event) => {
            if (event.key == "Enter") {
                this._clicked();
            }
        });
    }
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.change, () => this.render());
        this.connect(this.model.tool.change, () => this.render());
    }
    remove() {
        this._menu.remove();
        super.remove();
    }
    styles() {
        return [...super.styles(), tool_button_css, icons_css];
    }
    render() {
        super.render();
        this.class_list.add(tool_button[this.parent.model.location]);
        if (this.model.tool.disabled)
            this.class_list.add(tool_button.disabled);
        const icon_el = div({ class: tool_button.tool_icon });
        this.shadow_el.appendChild(icon_el);
        const icon = this.model.icon ?? this.model.tool.computed_icon;
        if (icon != null) {
            if (icon.startsWith("data:image")) {
                const url = `url("${encodeURI(icon)}")`;
                icon_el.style.backgroundImage = url;
            }
            else if (icon.startsWith("--")) {
                icon_el.style.backgroundImage = `var(${icon})`;
            }
            else if (icon.startsWith(".")) {
                const cls = icon.substring(1);
                icon_el.classList.add(cls);
            }
            else if (ToolIcon.valid(icon)) {
                const cls = `bk-tool-icon-${icon.replace(/_/g, "-")}`;
                icon_el.classList.add(cls);
            }
        }
        if (this.model.tool.menu != null) {
            const chevron_el = div({ class: tool_button.tool_chevron });
            this.shadow_el.appendChild(chevron_el);
        }
        const tooltip = this.model.tooltip ?? this.model.tool.tooltip;
        this.el.title = tooltip;
        this.el.tabIndex = 0;
    }
    _pressed() {
        const at = (() => {
            switch (this.parent.model.location) {
                case "right": return { left_of: this.el };
                case "left": return { right_of: this.el };
                case "above": return { below: this.el };
                case "below": return { above: this.el };
            }
        })();
        this._menu.toggle(at);
    }
}
ToolButtonView.__name__ = "ToolButtonView";
export class ToolButton extends UIElement {
    constructor(attrs) {
        super(attrs);
    }
}
_a = ToolButton;
ToolButton.__name__ = "ToolButton";
(() => {
    _a.define(({ String, Regex, Ref, Nullable, Or }) => ({
        tool: [Or(Ref(Tool), Ref(ToolProxy))],
        icon: [Nullable(Or(ToolIcon, Regex(/^--/), Regex(/^\./), Regex(/^data:image/))), null],
        tooltip: [Nullable(String), null],
    }));
})();
//# sourceMappingURL=tool_button.js.map