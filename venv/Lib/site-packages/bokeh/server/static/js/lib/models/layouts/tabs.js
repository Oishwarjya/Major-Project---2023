var _a;
import { div, show, hide, empty } from "../../core/dom";
import { remove_at } from "../../core/util/array";
import { Container } from "../../core/layout/grid";
import { Location } from "../../core/enums";
import { LayoutDOM, LayoutDOMView } from "./layout_dom";
import { TabPanel } from "./tab_panel";
import { GridAlignmentLayout } from "./alignments";
import tabs_css, * as tabs from "../../styles/tabs.css";
import icons_css from "../../styles/icons.css";
export class TabsView extends LayoutDOMView {
    connect_signals() {
        super.connect_signals();
        const { tabs, active } = this.model.properties;
        this.on_change(tabs, () => {
            this._update_headers();
            this.update_children();
        });
        this.on_change(active, () => {
            this.update_active();
        });
    }
    styles() {
        return [...super.styles(), tabs_css, icons_css];
    }
    get child_models() {
        return this.model.tabs.map((tab) => tab.child);
    }
    _intrinsic_display() {
        return { inner: this.model.flow_mode, outer: "grid" };
    }
    _update_layout() {
        super._update_layout();
        const loc = this.model.tabs_location;
        this.class_list.remove([...Location].map((loc) => tabs[loc]));
        this.class_list.add(tabs[loc]);
        const layoutable = new Container();
        for (const view of this.child_views) {
            view.style.append(":host", { grid_area: "stack" });
            if (view instanceof LayoutDOMView && view.layout != null) {
                layoutable.add({ r0: 0, c0: 0, r1: 1, c1: 1 }, view);
            }
        }
        if (layoutable.size != 0) {
            this.layout = new GridAlignmentLayout(layoutable);
            this.layout.set_sizing();
        }
        else {
            delete this.layout;
        }
    }
    _after_layout() {
        super._after_layout();
        const { child_views } = this;
        for (const child_view of child_views)
            hide(child_view.el);
        const { active } = this.model;
        if (active in child_views) {
            const tab = child_views[active];
            show(tab.el);
        }
    }
    render() {
        super.render();
        this.header_el = div({ class: tabs.header });
        this.shadow_el.append(this.header_el);
        this._update_headers();
    }
    _update_headers() {
        const { active } = this.model;
        const headers = this.model.tabs.map((tab, i) => {
            const el = div({ class: [tabs.tab, i == active ? tabs.active : null], tabIndex: 0 }, tab.title);
            el.addEventListener("click", (event) => {
                if (this.model.disabled)
                    return;
                if (event.target == event.currentTarget)
                    this.change_active(i);
            });
            if (tab.closable) {
                const close_el = div({ class: tabs.close });
                close_el.addEventListener("click", (event) => {
                    if (event.target == event.currentTarget) {
                        this.model.tabs = remove_at(this.model.tabs, i);
                        const ntabs = this.model.tabs.length;
                        if (this.model.active > ntabs - 1)
                            this.model.active = ntabs - 1;
                    }
                });
                el.appendChild(close_el);
            }
            if (this.model.disabled || tab.disabled) {
                el.classList.add(tabs.disabled);
            }
            return el;
        });
        this.header_els = headers;
        empty(this.header_el);
        this.header_el.append(...headers);
    }
    change_active(i) {
        if (i != this.model.active) {
            this.model.active = i;
        }
    }
    update_active() {
        const i = this.model.active;
        const { header_els } = this;
        for (const el of header_els) {
            el.classList.remove(tabs.active);
        }
        if (i in header_els) {
            header_els[i].classList.add(tabs.active);
        }
        const { child_views } = this;
        for (const child_view of child_views) {
            hide(child_view.el);
        }
        if (i in child_views) {
            show(child_views[i].el);
        }
    }
}
TabsView.__name__ = "TabsView";
export class Tabs extends LayoutDOM {
    constructor(attrs) {
        super(attrs);
    }
}
_a = Tabs;
Tabs.__name__ = "Tabs";
(() => {
    _a.prototype.default_view = TabsView;
    _a.define(({ Int, Array, Ref }) => ({
        tabs: [Array(Ref(TabPanel)), []],
        tabs_location: [Location, "above"],
        active: [Int, 0],
    }));
})();
//# sourceMappingURL=tabs.js.map