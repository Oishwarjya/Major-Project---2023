var _a;
import { LayoutProvider } from "./layout_provider";
import { Dict } from "../../core/util/object";
export class StaticLayoutProvider extends LayoutProvider {
    constructor(attrs) {
        super(attrs);
    }
    get_node_coordinates(node_source) {
        const data = new Dict(node_source.data);
        const index = data.get("index") ?? [];
        const n = index.length;
        const xs = new Float64Array(n);
        const ys = new Float64Array(n);
        const { graph_layout } = this;
        for (let i = 0; i < n; i++) {
            const j = index[i];
            const [x, y] = graph_layout.get(j) ?? [NaN, NaN];
            xs[i] = x;
            ys[i] = y;
        }
        return [xs, ys];
    }
    get_edge_coordinates(edge_source) {
        const data = new Dict(edge_source.data);
        const starts = data.get("start") ?? [];
        const ends = data.get("end") ?? [];
        const n = Math.min(starts.length, ends.length);
        const xs = [];
        const ys = [];
        const edge_xs = data.get("xs");
        const edge_ys = data.get("ys");
        const has_paths = edge_xs != null && edge_ys != null;
        const { graph_layout } = this;
        for (let i = 0; i < n; i++) {
            const in_layout = graph_layout.has(starts[i]) && graph_layout.has(ends[i]);
            if (has_paths && in_layout) {
                xs.push(edge_xs[i]);
                ys.push(edge_ys[i]);
            }
            else {
                const start = graph_layout.get(starts[i]) ?? [NaN, NaN];
                const end = graph_layout.get(ends[i]) ?? [NaN, NaN];
                xs.push([start[0], end[0]]);
                ys.push([start[1], end[1]]);
            }
        }
        return [xs, ys];
    }
}
_a = StaticLayoutProvider;
StaticLayoutProvider.__name__ = "StaticLayoutProvider";
(() => {
    _a.define(({ Number, Int, Arrayable, Map }) => ({
        graph_layout: [Map(Int, Arrayable(Number)), new globalThis.Map()], // TODO: length == 2
    }));
})();
//# sourceMappingURL=static_layout_provider.js.map