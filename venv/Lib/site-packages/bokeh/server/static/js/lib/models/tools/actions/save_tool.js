var _a;
import { ActionTool, ActionToolView } from "./action_tool";
import { tool_icon_save } from "../../../styles/icons.css";
export class SaveToolView extends ActionToolView {
    async copy() {
        const blob = await this.parent.export().to_blob();
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
    }
    async save(name) {
        const blob = await this.parent.export().to_blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = name; // + ".png" | "svg" (inferred from MIME type)
        link.target = "_blank";
        link.dispatchEvent(new MouseEvent("click"));
    }
    doit(action = "save") {
        switch (action) {
            case "save": {
                const filename = this.model.filename ?? prompt("Enter filename", "bokeh_plot");
                if (filename != null) {
                    this.save(filename);
                }
                break;
            }
            case "copy": {
                this.copy();
                break;
            }
        }
    }
}
SaveToolView.__name__ = "SaveToolView";
export class SaveTool extends ActionTool {
    constructor(attrs) {
        super(attrs);
        this.tool_name = "Save";
        this.tool_icon = tool_icon_save;
    }
    get menu() {
        return [
            {
                icon: "bk-tool-icon-copy",
                tooltip: "Copy image to clipboard",
                if: () => typeof ClipboardItem !== "undefined",
                handler: () => {
                    this.do.emit("copy");
                },
            },
        ];
    }
}
_a = SaveTool;
SaveTool.__name__ = "SaveTool";
(() => {
    _a.prototype.default_view = SaveToolView;
    _a.define(({ String, Nullable }) => ({
        filename: [Nullable(String), null],
    }));
    _a.register_alias("save", () => new SaveTool());
})();
//# sourceMappingURL=save_tool.js.map