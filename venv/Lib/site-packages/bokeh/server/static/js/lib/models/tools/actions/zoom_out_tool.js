var _a;
import { ZoomBaseTool, ZoomBaseToolView } from "./zoom_base_tool";
import { tool_icon_zoom_out } from "../../../styles/icons.css";
export class ZoomOutToolView extends ZoomBaseToolView {
}
ZoomOutToolView.__name__ = "ZoomOutToolView";
export class ZoomOutTool extends ZoomBaseTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Zoom Out";
        this.tool_icon = tool_icon_zoom_out;
    }
    get_factor() {
        return -this.factor / (1 - this.factor);
    }
}
_a = ZoomOutTool;
ZoomOutTool.__name__ = "ZoomOutTool";
(() => {
    _a.prototype.default_view = ZoomOutToolView;
    _a.define(({ Boolean }) => ({
        maintain_focus: [Boolean, true],
    }));
    _a.register_alias("zoom_out", () => new ZoomOutTool({ dimensions: "both" }));
    _a.register_alias("xzoom_out", () => new ZoomOutTool({ dimensions: "width" }));
    _a.register_alias("yzoom_out", () => new ZoomOutTool({ dimensions: "height" }));
})();
//# sourceMappingURL=zoom_out_tool.js.map