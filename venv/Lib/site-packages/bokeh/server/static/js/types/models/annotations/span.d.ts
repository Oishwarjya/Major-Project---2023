import { Annotation, AnnotationView } from "./annotation";
import * as mixins from "../../core/property_mixins";
import * as visuals from "../../core/visuals";
import { CoordinateUnits, Dimension } from "../../core/enums";
import * as p from "../../core/properties";
export declare class SpanView extends AnnotationView {
    model: Span;
    visuals: Span.Visuals;
    connect_signals(): void;
    protected _render(): void;
}
export declare namespace Span {
    type Attrs = p.AttrsOf<Props>;
    type Props = Annotation.Props & {
        location: p.Property<number | null>;
        location_units: p.Property<CoordinateUnits>;
        dimension: p.Property<Dimension>;
    } & Mixins;
    type Mixins = mixins.Line;
    type Visuals = Annotation.Visuals & {
        line: visuals.Line;
    };
}
export interface Span extends Span.Attrs {
}
export declare class Span extends Annotation {
    properties: Span.Props;
    __view_type__: SpanView;
    constructor(attrs?: Partial<Span.Attrs>);
}
//# sourceMappingURL=span.d.ts.map