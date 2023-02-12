import { Filter } from "./filter";
import { Indices } from "../../core/types";
export class AllIndices extends Filter {
    constructor(attrs) {
        super(attrs);
    }
    compute_indices(source) {
        const size = source.get_length() ?? 1;
        return Indices.all_set(size);
    }
}
AllIndices.__name__ = "AllIndices";
//# sourceMappingURL=all_indices.js.map