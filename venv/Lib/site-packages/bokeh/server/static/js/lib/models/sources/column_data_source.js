var _a;
import { ColumnarDataSource } from "./columnar_data_source";
export class ColumnDataSource extends ColumnarDataSource {
    constructor(attrs) {
        super(attrs);
    }
    stream(new_data, rollover, { sync } = {}) {
        this.stream_to(this.properties.data, new_data, rollover, { sync });
    }
    patch(patches, { sync } = {}) {
        this.patch_to(this.properties.data, patches, { sync });
    }
}
_a = ColumnDataSource;
ColumnDataSource.__name__ = "ColumnDataSource";
(() => {
    _a.define(({ Any, Dict, Arrayable }) => ({
        data: [Dict(Arrayable(Any)), {}],
    }));
})();
//# sourceMappingURL=column_data_source.js.map