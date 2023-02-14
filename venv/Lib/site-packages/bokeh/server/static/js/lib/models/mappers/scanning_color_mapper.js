import { ContinuousColorMapper } from "./continuous_color_mapper";
import { left_edge_index } from "../../core/util/arrayable";
export class ScanningColorMapper extends ContinuousColorMapper {
    constructor(attrs) {
        super(attrs);
    }
    index_to_value(index) {
        const scan_data = this._scan_data;
        return scan_data.binning[index];
    }
    value_to_index(value, palette_length) {
        const scan_data = this._scan_data;
        if (value < scan_data.binning[0])
            return -1;
        else if (value > scan_data.binning[scan_data.binning.length - 1])
            return palette_length;
        else
            return left_edge_index(value, scan_data.binning);
    }
}
ScanningColorMapper.__name__ = "ScanningColorMapper";
//# sourceMappingURL=scanning_color_mapper.js.map