import { ContinuousColorMapper } from "./continuous_color_mapper";
import { min, max } from "../../core/util/arrayable";
import { clamp } from "../../core/util/math";
export class LogColorMapper extends ContinuousColorMapper {
    constructor(attrs) {
        super(attrs);
    }
    scan(data, n) {
        const low = this.low != null ? this.low : min(data);
        const high = this.high != null ? this.high : max(data);
        const scale = n / Math.log(high / low); // subtract the low offset
        return { max: high, min: low, scale };
    }
    index_to_value(index) {
        const scan_data = this._scan_data;
        return scan_data.min * Math.exp(index / scan_data.scale);
    }
    value_to_index(value, palette_length) {
        const scan_data = this._scan_data;
        // This handles the edge case where value == high, since the code below maps
        // values exactly equal to high to palette.length when it should be one less.
        if (value == scan_data.max)
            return palette_length - 1;
        else if (value > scan_data.max)
            return palette_length;
        else if (value < scan_data.min)
            return -1;
        const log = Math.log(value / scan_data.min);
        const index = Math.floor(log * scan_data.scale);
        return clamp(index, -1, palette_length);
    }
}
LogColorMapper.__name__ = "LogColorMapper";
//# sourceMappingURL=log_color_mapper.js.map