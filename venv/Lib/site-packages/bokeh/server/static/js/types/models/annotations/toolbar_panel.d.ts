import { Annotation, AnnotationView } from "./annotation";
import { Toolbar, ToolbarView } from "../tools/toolbar";
import { IterViews } from "../../core/build_views";
import { Size, Layoutable } from "../../core/layout";
import { Panel } from "../../core/layout/side_panel";
import * as p from "../../core/properties";
export declare class ToolbarPanelView extends AnnotationView {
    model: ToolbarPanel;
    panel: Panel;
    layout: Layoutable;
    update_layout(): void;
    has_finished(): boolean;
    children(): IterViews;
    toolbar_view: ToolbarView;
    el: HTMLElement;
    initialize(): void;
    lazy_initialize(): Promise<void>;
    connect_signals(): void;
    remove(): void;
    render(): void;
    private _invalidate_toolbar;
    private _previous_bbox;
    protected _render(): void;
    protected _get_size(): Size;
}
export declare namespace ToolbarPanel {
    type Attrs = p.AttrsOf<Props>;
    type Props = Annotation.Props & {
        toolbar: p.Property<Toolbar>;
    };
}
export interface ToolbarPanel extends ToolbarPanel.Attrs {
}
export declare class ToolbarPanel extends Annotation {
    properties: ToolbarPanel.Props;
    __view_type__: ToolbarPanelView;
    constructor(attrs?: Partial<ToolbarPanel.Attrs>);
}
//# sourceMappingURL=toolbar_panel.d.ts.map