var _a;
import { View } from "../../core/view";
import { ToolIcon } from "../../core/enums";
import { min, max } from "../../core/util/array";
import { isString } from "../../core/util/types";
import { Model } from "../../model";
export class ToolView extends View {
    connect_signals() {
        super.connect_signals();
        this.connect(this.model.properties.active.change, () => {
            if (this.model.active)
                this.activate();
            else
                this.deactivate();
        });
    }
    get overlays() {
        return [];
    }
    // activate is triggered by toolbar ui actions
    activate() { }
    // deactivate is triggered by toolbar ui actions
    deactivate() { }
}
ToolView.__name__ = "ToolView";
export class Tool extends Model {
    constructor(attrs) {
        super(attrs);
    }
    get event_role() {
        const { event_type } = this;
        return isString(event_type) ? event_type : "multi";
    }
    get event_types() {
        const { event_type } = this;
        return event_type == null ? [] : (isString(event_type) ? [event_type] : event_type);
    }
    get tooltip() {
        return this.description ?? this.tool_name;
    }
    get computed_icon() {
        const { icon, tool_icon } = this;
        return icon ?? (tool_icon != null ? `.${tool_icon}` : undefined);
    }
    get menu() {
        return null;
    }
    // utility function to get limits along both dimensions, given
    // optional dimensional constraints
    _get_dim_limits([sx0, sy0], [sx1, sy1], frame, dims) {
        const hr = frame.bbox.h_range;
        let sxlim;
        if (dims == "width" || dims == "both") {
            sxlim = [min([sx0, sx1]), max([sx0, sx1])];
            sxlim = [max([sxlim[0], hr.start]), min([sxlim[1], hr.end])];
        }
        else
            sxlim = [hr.start, hr.end];
        const vr = frame.bbox.v_range;
        let sylim;
        if (dims == "height" || dims == "both") {
            sylim = [min([sy0, sy1]), max([sy0, sy1])];
            sylim = [max([sylim[0], vr.start]), min([sylim[1], vr.end])];
        }
        else
            sylim = [vr.start, vr.end];
        return [sxlim, sylim];
    }
    // utility function to return a tool name, modified
    // by the active dimensions. Used by tools that have dimensions
    _get_dim_tooltip(dims) {
        const { description, tool_name } = this;
        if (description != null)
            return description;
        else if (dims == "both")
            return tool_name;
        else if (dims == "auto")
            return `${tool_name} (either x, y or both dimensions)`;
        else
            return `${tool_name} (${dims == "width" ? "x" : "y"}-axis)`;
    }
    static register_alias(name, fn) {
        this.prototype._known_aliases.set(name, fn);
    }
    static from_string(name) {
        const fn = this.prototype._known_aliases.get(name);
        if (fn != null)
            return fn();
        else {
            const names = [...this.prototype._known_aliases.keys()];
            throw new Error(`unexpected tool name '${name}', possible tools are ${names.join(", ")}`);
        }
    }
}
_a = Tool;
Tool.__name__ = "Tool";
(() => {
    _a.prototype._known_aliases = new Map();
    _a.define(({ String, Regex, Nullable, Or }) => ({
        icon: [Nullable(Or(ToolIcon, Regex(/^--/), Regex(/^\./), Regex(/^data:image/))), null],
        description: [Nullable(String), null],
    }));
    _a.internal(({ Boolean }) => ({
        active: [Boolean, false],
        disabled: [Boolean, false],
    }));
})();
//# sourceMappingURL=tool.js.map