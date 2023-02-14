import { HasProps } from "./has_props";
import { Attrs } from "./types";
import { GeometryData } from "./geometry";
import { serialize, Serializable, Serializer } from "./serialization";
import { equals, Equatable, Comparator } from "./util/eq";
export declare type BokehEventType = "document_ready" | ModelEventType;
export declare type ModelEventType = "button_click" | "menu_item_click" | UIEventType;
export declare type UIEventType = "lodstart" | "lodend" | "rangesupdate" | "selectiongeometry" | "reset" | PointEventType;
export declare type PointEventType = "pan" | "pinch" | "rotate" | "wheel" | "mousemove" | "mouseenter" | "mouseleave" | "tap" | "doubletap" | "press" | "pressup" | "panstart" | "panend" | "pinchstart" | "pinchend" | "rotatestart" | "rotateend";
export declare type BokehEventMap = {
    document_ready: DocumentReady;
    button_click: ButtonClick;
    menu_item_click: MenuItemClick;
    lodstart: LODStart;
    lodend: LODEnd;
    rangesupdate: RangesUpdate;
    selectiongeometry: SelectionGeometry;
    reset: Reset;
    pan: Pan;
    pinch: Pinch;
    rotate: Rotate;
    wheel: MouseWheel;
    mousemove: MouseMove;
    mouseenter: MouseEnter;
    mouseleave: MouseLeave;
    tap: Tap;
    doubletap: DoubleTap;
    press: Press;
    pressup: PressUp;
    panstart: PanStart;
    panend: PanEnd;
    pinchstart: PinchStart;
    pinchend: PinchEnd;
    rotatestart: RotateStart;
    rotateend: RotateEnd;
};
export declare type BokehEventRep = {
    type: "event";
    name: string;
    values: unknown;
};
export declare abstract class BokehEvent implements Serializable, Equatable {
    event_name: string;
    [serialize](serializer: Serializer): BokehEventRep;
    [equals](that: this, cmp: Comparator): boolean;
    protected abstract get event_values(): Attrs;
}
export declare abstract class ModelEvent extends BokehEvent {
    origin: HasProps | null;
    protected get event_values(): Attrs;
}
export declare class DocumentReady extends BokehEvent {
    protected get event_values(): Attrs;
}
export declare class ButtonClick extends ModelEvent {
}
export declare class MenuItemClick extends ModelEvent {
    readonly item: string;
    constructor(item: string);
    protected get event_values(): Attrs;
}
export declare abstract class UIEvent extends ModelEvent {
}
export declare class LODStart extends UIEvent {
}
export declare class LODEnd extends UIEvent {
}
export declare class RangesUpdate extends UIEvent {
    readonly x0: number;
    readonly x1: number;
    readonly y0: number;
    readonly y1: number;
    constructor(x0: number, x1: number, y0: number, y1: number);
    protected get event_values(): Attrs;
}
export declare class SelectionGeometry extends UIEvent {
    readonly geometry: GeometryData;
    readonly final: boolean;
    constructor(geometry: GeometryData, final: boolean);
    protected get event_values(): Attrs;
}
export declare class Reset extends UIEvent {
}
export declare abstract class PointEvent extends UIEvent {
    readonly sx: number;
    readonly sy: number;
    readonly x: number;
    readonly y: number;
    constructor(sx: number, sy: number, x: number, y: number);
    protected get event_values(): Attrs;
}
export declare class Pan extends PointEvent {
    readonly delta_x: number;
    readonly delta_y: number;
    constructor(sx: number, sy: number, x: number, y: number, delta_x: number, delta_y: number);
    protected get event_values(): Attrs;
}
export declare class Pinch extends PointEvent {
    readonly scale: number;
    constructor(sx: number, sy: number, x: number, y: number, scale: number);
    protected get event_values(): Attrs;
}
export declare class Rotate extends PointEvent {
    readonly rotation: number;
    constructor(sx: number, sy: number, x: number, y: number, rotation: number);
    protected get event_values(): Attrs;
}
export declare class MouseWheel extends PointEvent {
    readonly delta: number;
    constructor(sx: number, sy: number, x: number, y: number, delta: number);
    protected get event_values(): Attrs;
}
export declare class MouseMove extends PointEvent {
}
export declare class MouseEnter extends PointEvent {
}
export declare class MouseLeave extends PointEvent {
}
export declare class Tap extends PointEvent {
}
export declare class DoubleTap extends PointEvent {
}
export declare class Press extends PointEvent {
}
export declare class PressUp extends PointEvent {
}
export declare class PanStart extends PointEvent {
}
export declare class PanEnd extends PointEvent {
}
export declare class PinchStart extends PointEvent {
}
export declare class PinchEnd extends PointEvent {
}
export declare class RotateStart extends PointEvent {
}
export declare class RotateEnd extends PointEvent {
}
//# sourceMappingURL=bokeh_events.d.ts.map