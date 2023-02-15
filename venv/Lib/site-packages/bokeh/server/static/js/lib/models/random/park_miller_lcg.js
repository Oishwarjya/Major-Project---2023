var _a;
import { RandomGenerator } from "./random_generator";
import { LCGRandom } from "../../core/util/random";
export class ParkMillerLCG extends RandomGenerator {
    constructor(attrs) {
        super(attrs);
    }
    generator() {
        return new LCGRandom(this.seed ?? Date.now());
    }
}
_a = ParkMillerLCG;
ParkMillerLCG.__name__ = "ParkMillerLCG";
(() => {
    _a.define(({ Int, Nullable }) => ({
        seed: [Nullable(Int), null],
    }));
})();
//# sourceMappingURL=park_miller_lcg.js.map