import { Annotation, AnnotationView } from "./annotation";
import * as mixins from "../../core/property_mixins";
import * as visuals from "../../core/visuals";
import { CoordinateUnits } from "../../core/enums";
import * as p from "../../core/properties";
import { BBox, LRTB } from "../../core/util/bbox";
export declare const EDGE_TOLERANCE = 2.5;
export declare class BoxAnnotationView extends AnnotationView {
    model: BoxAnnotation;
    visuals: BoxAnnotation.Visuals;
    protected bbox: BBox;
    connect_signals(): void;
    protected _render(): void;
    protected _paint_box(): void;
    interactive_bbox(): BBox;
    interactive_hit(sx: number, sy: number): boolean;
    cursor(sx: number, sy: number): string | null;
}
export declare namespace BoxAnnotation {
    type Attrs = p.AttrsOf<Props>;
    type Props = Annotation.Props & {
        top: p.Property<number | null>;
        bottom: p.Property<number | null>;
        left: p.Property<number | null>;
        right: p.Property<number | null>;
        top_units: p.Property<CoordinateUnits>;
        bottom_units: p.Property<CoordinateUnits>;
        left_units: p.Property<CoordinateUnits>;
        right_units: p.Property<CoordinateUnits>;
        ew_cursor: p.Property<string | null>;
        ns_cursor: p.Property<string | null>;
        in_cursor: p.Property<string | null>;
    } & Mixins;
    type Mixins = mixins.Line & mixins.Fill & mixins.Hatch;
    type Visuals = Annotation.Visuals & {
        line: visuals.Line;
        fill: visuals.Fill;
        hatch: visuals.Hatch;
    };
}
export interface BoxAnnotation extends BoxAnnotation.Attrs {
}
export declare class BoxAnnotation extends Annotation {
    properties: BoxAnnotation.Props;
    __view_type__: BoxAnnotationView;
    constructor(attrs?: Partial<BoxAnnotation.Attrs>);
    update({ left, right, top, bottom }: LRTB): void;
    clear(): void;
}
//# sourceMappingURL=box_annotation.d.ts.map