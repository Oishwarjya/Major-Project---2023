import { SelectTool, SelectToolView } from "./select_tool";
import { PolyAnnotation } from "../../annotations/poly_annotation";
import { SelectionMode } from "../../../core/enums";
import { TapEvent, KeyEvent } from "../../../core/ui_events";
import * as p from "../../../core/properties";
export declare class PolySelectToolView extends SelectToolView {
    model: PolySelectTool;
    get overlays(): import("../..").Renderer[];
    protected sxs: number[];
    protected sys: number[];
    connect_signals(): void;
    _active_change(): void;
    _keyup(ev: KeyEvent): void;
    _doubletap(ev: TapEvent): void;
    _clear_data(): void;
    _tap(ev: TapEvent): void;
    _do_select(sx: number[], sy: number[], final: boolean, mode: SelectionMode): void;
}
export declare const DEFAULT_POLY_OVERLAY: () => PolyAnnotation;
export declare namespace PolySelectTool {
    type Attrs = p.AttrsOf<Props>;
    type Props = SelectTool.Props & {
        overlay: p.Property<PolyAnnotation>;
    };
}
export interface PolySelectTool extends PolySelectTool.Attrs {
}
export declare class PolySelectTool extends SelectTool {
    properties: PolySelectTool.Props;
    __view_type__: PolySelectToolView;
    constructor(attrs?: Partial<PolySelectTool.Attrs>);
    tool_name: string;
    tool_icon: string;
    event_type: "tap";
    default_order: number;
}
//# sourceMappingURL=poly_select_tool.d.ts.map