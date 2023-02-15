import { Model } from "../../model";
import { Styles } from "../dom/styles";
import { Align } from "../../core/enums";
import { SizingPolicy } from "../../core/layout";
import { DOMComponentView } from "../../core/dom_view";
import { SerializableState } from "../../core/view";
import { CSSStyles, StyleSheet, StyleSheetLike } from "../../core/dom";
import { CanvasLayer } from "../../core/util/canvas";
import { BBox } from "../../core/util/bbox";
import * as p from "../../core/properties";
export declare type DOMBoxSizing = {
    width_policy: SizingPolicy | "auto";
    height_policy: SizingPolicy | "auto";
    width: number | null;
    height: number | null;
    aspect_ratio: number | "auto" | null;
    halign?: Align;
    valign?: Align;
};
export declare abstract class UIElementView extends DOMComponentView {
    model: UIElement;
    protected readonly _display: StyleSheet;
    readonly style: StyleSheet;
    get stylesheets(): StyleSheet[];
    _stylesheets(): Iterable<StyleSheet>;
    get classes(): string[];
    _classes(): Iterable<string>;
    styles(): StyleSheetLike[];
    update_style(): void;
    box_sizing(): DOMBoxSizing;
    private _bbox?;
    get bbox(): BBox;
    update_bbox(): void;
    protected _update_bbox(): void;
    protected _resize_observer: ResizeObserver;
    initialize(): void;
    connect_signals(): void;
    remove(): void;
    protected _after_resize(): void;
    after_resize(): void;
    render_to(element: Node): void;
    render(): void;
    after_render(): void;
    private _is_displayed;
    protected get is_displayed(): boolean;
    protected _apply_styles(): void;
    protected _apply_stylesheets(stylesheets: (StyleSheetLike | {
        [key: string]: CSSStyles | Styles;
    })[]): void;
    protected _apply_visible(): void;
    export(type?: "auto" | "png" | "svg", hidpi?: boolean): CanvasLayer;
    serializable_state(): SerializableState;
}
export declare namespace UIElement {
    type Attrs = p.AttrsOf<Props>;
    type Props = Model.Props & {
        visible: p.Property<boolean>;
        classes: p.Property<string[]>;
        styles: p.Property<CSSStyles | Styles>;
        stylesheets: p.Property<(string | {
            [key: string]: CSSStyles | Styles;
        })[]>;
    };
}
export interface UIElement extends UIElement.Attrs {
}
export declare abstract class UIElement extends Model {
    properties: UIElement.Props;
    __view_type__: UIElementView;
    constructor(attrs?: Partial<UIElement.Attrs>);
}
//# sourceMappingURL=ui_element.d.ts.map