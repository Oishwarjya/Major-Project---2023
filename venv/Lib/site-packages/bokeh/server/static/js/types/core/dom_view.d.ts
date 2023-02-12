import { View } from "./view";
import { StyleSheetLike, ClassList } from "./dom";
export interface DOMView extends View {
    constructor: Function & {
        tag_name: keyof HTMLElementTagNameMap;
    };
}
export declare abstract class DOMView extends View {
    parent: DOMView | null;
    static tag_name: keyof HTMLElementTagNameMap;
    el: Node;
    shadow_el?: ShadowRoot;
    get children_el(): Node;
    initialize(): void;
    remove(): void;
    css_classes(): string[];
    styles(): StyleSheetLike[];
    abstract render(): void;
    render_to(element: Node): void;
    finish(): void;
    protected _createElement(): this["el"];
}
export declare abstract class DOMElementView extends DOMView {
    el: HTMLElement;
    class_list: ClassList;
    initialize(): void;
}
export declare abstract class DOMComponentView extends DOMElementView {
    parent: DOMElementView | null;
    readonly root: DOMComponentView;
    shadow_el: ShadowRoot;
    initialize(): void;
    styles(): StyleSheetLike[];
    empty(): void;
    render(): void;
    protected _apply_stylesheets(stylesheets: StyleSheetLike[]): void;
    protected _apply_classes(classes: string[]): void;
}
//# sourceMappingURL=dom_view.d.ts.map