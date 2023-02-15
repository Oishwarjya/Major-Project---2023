import { LayoutDOM, LayoutDOMView, FullDisplay } from "./layout_dom";
import { UIElement } from "../ui/ui_element";
import * as p from "../../core/properties";
import * as k from "../../core/kinds";
export declare type TrackAlign = "start" | "center" | "end" | "auto";
export declare const TrackAlign: k.Kinds.Enum<"auto" | "start" | "center" | "end">;
export declare type TrackSize = string;
export declare type TrackSizing = {
    size?: TrackSize;
    align?: TrackAlign;
};
export declare type TrackSizingLike = TrackSize | TrackSizing;
export declare type TracksSizing = TrackSizingLike | TrackSizingLike[] | Map<number, TrackSizingLike>;
export declare const TrackSize: k.Kinds.String;
export declare const TrackSizing: k.Kinds.Struct<{
    size: string | undefined;
    align: "auto" | "start" | "center" | "end" | undefined;
}>;
export declare const TrackSizingLike: k.Kinds.Or<[string, {
    size: string | undefined;
    align: "auto" | "start" | "center" | "end" | undefined;
}]>;
export declare const TracksSizing: k.Kinds.Or<[string | {
    size: string | undefined;
    align: "auto" | "start" | "center" | "end" | undefined;
}, (string | {
    size: string | undefined;
    align: "auto" | "start" | "center" | "end" | undefined;
})[], Map<number, string | {
    size: string | undefined;
    align: "auto" | "start" | "center" | "end" | undefined;
}>]>;
export declare abstract class CSSGridBoxView extends LayoutDOMView {
    model: CSSGridBox;
    connect_signals(): void;
    get child_models(): UIElement[];
    protected _intrinsic_display(): FullDisplay;
    protected abstract get _children(): [UIElement, number, number, number?, number?][];
    protected abstract get _rows(): TracksSizing | null;
    protected abstract get _cols(): TracksSizing | null;
    _update_layout(): void;
}
export declare namespace CSSGridBox {
    type Attrs = p.AttrsOf<Props>;
    type Props = LayoutDOM.Props & {
        spacing: p.Property<number | [number, number]>;
    };
}
export interface CSSGridBox extends CSSGridBox.Attrs {
}
export declare abstract class CSSGridBox extends LayoutDOM {
    properties: CSSGridBox.Props;
    __view_type__: CSSGridBoxView;
    constructor(attrs?: Partial<CSSGridBox.Attrs>);
}
//# sourceMappingURL=css_grid_box.d.ts.map