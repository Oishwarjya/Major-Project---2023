import { CSSGridBox, CSSGridBoxView, TracksSizing } from "./css_grid_box";
import { UIElement } from "../ui/ui_element";
import * as p from "../../core/properties";
declare type ChildItem = {
    child: UIElement;
    col?: number;
    span?: number;
};
export declare class HBoxView extends CSSGridBoxView {
    model: HBox;
    connect_signals(): void;
    protected get _children(): [UIElement, number, number, number?, number?][];
    protected get _rows(): TracksSizing | null;
    protected get _cols(): TracksSizing | null;
}
export declare namespace HBox {
    type Attrs = p.AttrsOf<Props>;
    type Props = CSSGridBox.Props & {
        children: p.Property<ChildItem[]>;
        cols: p.Property<TracksSizing | null>;
    };
}
export interface HBox extends HBox.Attrs {
}
export declare class HBox extends CSSGridBox {
    properties: HBox.Props;
    __view_type__: HBoxView;
    constructor(attrs?: Partial<HBox.Attrs>);
}
export {};
//# sourceMappingURL=hbox.d.ts.map