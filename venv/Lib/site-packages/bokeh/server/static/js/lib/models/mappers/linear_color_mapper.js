import { ContinuousColorMapper } from "./continuous_color_mapper";
import { min, max } from "../../core/util/arrayable";
import { clamp } from "../../core/util/math";
export class LinearColorMapper extends ContinuousColorMapper {
    constructor(attrs) {
        super(attrs);
    }
    scan(data, n) {
        const low = this.low != null ? this.low : min(data);
        const high = this.high != null ? this.high : max(data);
        const norm_factor = 1 / (high - low);
        const normed_interval = 1 / n;
        return { max: high, min: low, norm_factor, normed_interval };
    }
    index_to_value(index) {
        const scan_data = this._scan_data;
        return scan_data.min + scan_data.normed_interval * index / scan_data.norm_factor;
    }
    value_to_index(value, palette_length) {
        const scan_data = this._scan_data;
        // This handles the edge case where value == high, since the code below maps
        // values exactly equal to high to palette.length when it should be one less.
        if (value == scan_data.max)
            return palette_length - 1;
        const normed_value = (value - scan_data.min) * scan_data.norm_factor;
        const index = Math.floor(normed_value / scan_data.normed_interval);
        return clamp(index, -1, palette_length);
    }
}
LinearColorMapper.__name__ = "LinearColorMapper";
//# sourceMappingURL=linear_color_mapper.js.map