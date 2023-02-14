var _a;
import { UIElement, UIElementView } from "./ui_element";
import { Selector } from "../selectors/selector";
import { HTML } from "../dom/html";
import { Anchor, TooltipAttachment } from "../../core/enums";
import { div, bounding_box } from "../../core/dom";
import { DOMElementView } from "../../core/dom_view";
import { isString } from "../../core/util/types";
import { assert } from "../../core/util/assert";
import { logger } from "../../core/logging";
import { build_view } from "../../core/build_views";
import tooltips_css, * as tooltips from "../../styles/tooltips.css";
import icons_css from "../../styles/icons.css";
const arrow_size = 10; // XXX: keep in sync with less
export class TooltipView extends UIElementView {
    constructor() {
        super(...arguments);
        this._html = null;
    }
    get target() {
        return this._target;
    }
    _init_target() {
        const { target } = this.model;
        const el = (() => {
            if (target instanceof UIElement) {
                return this.owner.find_one(target)?.el ?? null;
            }
            else if (target instanceof Selector) {
                return target.find_one(document);
            }
            else if (target instanceof Node) {
                return target;
            }
            else {
                const { parent } = this;
                return parent instanceof DOMElementView ? parent.el : null;
            }
        })();
        if (el instanceof Element)
            this._target = el;
        else {
            logger.warn(`unable to resolve target '${target}' for '${this}'`);
            this._target = document.body;
        }
    }
    initialize() {
        super.initialize();
        this._init_target();
    }
    *children() {
        yield* super.children();
        if (this._html != null)
            yield this._html;
    }
    async lazy_initialize() {
        await super.lazy_initialize();
        const { content } = this.model;
        if (content instanceof HTML) {
            this._html = await build_view(content, { parent: this });
        }
        this.render();
    }
    connect_signals() {
        super.connect_signals();
        this._observer = new ResizeObserver(() => {
            this._reposition();
        });
        this._observer.observe(this.target);
        const { target, content, closable, interactive, position, attachment, visible } = this.model.properties;
        this.on_change(target, () => {
            this._init_target();
            this._observer.disconnect();
            this._observer.observe(this.target);
            this.render();
        });
        this.on_change([content, closable, interactive], () => this.render());
        this.on_change([position, attachment, visible], () => this._reposition());
    }
    remove() {
        this._html?.remove();
        this._observer.disconnect();
        super.remove();
    }
    styles() {
        return [...super.styles(), tooltips_css, icons_css];
    }
    get content() {
        const { content } = this.model;
        if (isString(content)) {
            return document.createTextNode(content);
        }
        else if (content instanceof HTML) {
            assert(this._html != null);
            return this._html.el;
        }
        else
            return content;
    }
    render() {
        super.render();
        this._html?.render();
        this.content_el = div({ class: tooltips.tooltip_content }, this.content);
        this.shadow_el.appendChild(this.content_el);
        if (this.model.closable) {
            const close_el = div({ class: tooltips.close });
            close_el.addEventListener("click", () => {
                this.model.visible = false;
            });
            this.shadow_el.appendChild(close_el);
        }
        this.el.classList.toggle(tooltips.tooltip_arrow, this.model.show_arrow);
        this.el.classList.toggle(tooltips.non_interactive, !this.model.interactive);
        this._reposition();
    }
    _anchor_to_align(anchor) {
        switch (anchor) {
            case "top_left":
                return ["top", "left"];
            case "top":
            case "top_center":
                return ["top", "center"];
            case "top_right":
                return ["top", "right"];
            case "left":
            case "center_left":
                return ["center", "left"];
            case "center":
            case "center_center":
                return ["center", "center"];
            case "right":
            case "center_right":
                return ["center", "right"];
            case "bottom_left":
                return ["bottom", "left"];
            case "bottom":
            case "bottom_center":
                return ["bottom", "center"];
            case "bottom_right":
                return ["bottom", "right"];
        }
    }
    _reposition() {
        const { position, visible } = this.model;
        if (position == null || !visible) {
            this.el.remove();
            return;
        }
        const target_el = this.target.shadowRoot ?? this.target;
        target_el.appendChild(this.el);
        const bbox = bounding_box(this.target).relative();
        const [sx, sy] = (() => {
            if (isString(position)) {
                const [valign, halign] = this._anchor_to_align(position);
                const sx = (() => {
                    switch (halign) {
                        case "left": return bbox.left;
                        case "center": return bbox.hcenter;
                        case "right": return bbox.right;
                    }
                })();
                const sy = (() => {
                    switch (valign) {
                        case "top": return bbox.top;
                        case "center": return bbox.vcenter;
                        case "bottom": return bbox.bottom;
                    }
                })();
                return [sx, sy];
            }
            else
                return position;
        })();
        const side = (() => {
            const attachment = (() => {
                const { attachment } = this.model;
                if (attachment == "auto") {
                    if (isString(position)) {
                        const [valign, halign] = this._anchor_to_align(position);
                        if (halign != "center")
                            return halign == "left" ? "left" : "right";
                        if (valign != "center")
                            return valign == "top" ? "above" : "below";
                    }
                    return "horizontal";
                }
                else
                    return attachment;
            })();
            switch (attachment) {
                case "horizontal":
                    return sx < bbox.hcenter ? "right" : "left";
                case "vertical":
                    return sy < bbox.vcenter ? "below" : "above";
                default:
                    return attachment;
            }
        })();
        this.el.classList.remove(tooltips.right);
        this.el.classList.remove(tooltips.left);
        this.el.classList.remove(tooltips.above);
        this.el.classList.remove(tooltips.below);
        // slightly confusing: side "left" (for example) is relative to point that
        // is being annotated but CS class ".bk-left" is relative to the tooltip itself
        let top;
        let left = null;
        let right = null;
        const { width, height } = bounding_box(this.el);
        switch (side) {
            case "right":
                this.el.classList.add(tooltips.left);
                left = sx + (width - this.el.clientWidth) + arrow_size;
                top = sy - height / 2;
                break;
            case "left":
                this.el.classList.add(tooltips.right);
                right = (bbox.width - sx) + arrow_size;
                top = sy - height / 2;
                break;
            case "below":
                this.el.classList.add(tooltips.above);
                top = sy + (height - this.el.clientHeight) + arrow_size;
                left = Math.round(sx - width / 2);
                break;
            case "above":
                this.el.classList.add(tooltips.below);
                top = sy - height - arrow_size;
                left = Math.round(sx - width / 2);
                break;
        }
        this.el.style.top = `${top}px`;
        this.el.style.left = left != null ? `${left}px` : "";
        this.el.style.right = right != null ? `${right}px` : "";
    }
}
TooltipView.__name__ = "TooltipView";
export class Tooltip extends UIElement {
    constructor(attrs) {
        super(attrs);
    }
    clear() {
        this.position = null;
    }
}
_a = Tooltip;
Tooltip.__name__ = "Tooltip";
(() => {
    _a.prototype.default_view = TooltipView;
    _a.define(({ Boolean, Number, String, Tuple, Or, Ref, Nullable, Auto }) => ({
        target: [Or(Ref(UIElement), Ref(Selector), Ref(Node), Auto), "auto"],
        position: [Nullable(Or(Anchor, Tuple(Number, Number))), null],
        content: [Or(String, Ref(HTML), Ref(Node))],
        attachment: [Or(TooltipAttachment, Auto), "auto"],
        show_arrow: [Boolean, true],
        closable: [Boolean, false],
        interactive: [Boolean, true],
    }));
    _a.override({
        visible: false,
    });
})();
//# sourceMappingURL=tooltip.js.map