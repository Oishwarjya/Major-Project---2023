import { serialize } from "../serialization";
export class Slice {
    constructor({ start, stop, step } = {}) {
        this.start = start ?? null;
        this.stop = stop ?? null;
        this.step = step ?? null;
    }
    [serialize](serializer) {
        return {
            type: "slice",
            start: serializer.encode(this.start),
            stop: serializer.encode(this.stop),
            step: serializer.encode(this.step),
        };
    }
}
Slice.__name__ = "Slice";
//# sourceMappingURL=slice.js.map