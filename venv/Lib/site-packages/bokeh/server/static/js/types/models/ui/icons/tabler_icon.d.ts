import { Icon, IconView } from "./icon";
import { StyleSheet, ImportedStyleSheet, GlobalStyleSheet, StyleSheetLike } from "../../../core/dom";
import * as p from "../../../core/properties";
export declare class TablerIconView extends IconView {
    model: TablerIcon;
    protected static readonly _url = "https://unpkg.com/@tabler/icons@latest/iconfont";
    protected static readonly _fonts: GlobalStyleSheet;
    protected readonly _tabler: ImportedStyleSheet;
    protected readonly _style: StyleSheet;
    styles(): StyleSheetLike[];
    initialize(): void;
    render(): void;
}
export declare namespace TablerIcon {
    type Attrs = p.AttrsOf<Props>;
    type Props = Icon.Props & {
        icon_name: p.Property<string>;
    };
}
export interface TablerIcon extends TablerIcon.Attrs {
}
export declare class TablerIcon extends Icon {
    properties: TablerIcon.Props;
    __view_type__: TablerIconView;
    constructor(attrs?: Partial<TablerIcon.Attrs>);
}
//# sourceMappingURL=tabler_icon.d.ts.map