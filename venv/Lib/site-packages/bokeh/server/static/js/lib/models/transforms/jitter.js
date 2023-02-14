var _a;
import { RangeTransform } from "./range_transform";
import { FactorRange } from "../ranges/factor_range";
import { RandomGenerator } from "../random/random_generator";
import { Distribution } from "../../core/enums";
import { map } from "../../core/util/arrayable";
import { SystemRandom } from "../../core/util/random";
export class Jitter extends RangeTransform {
    constructor(attrs) {
        super(attrs);
        this._previous_offsets = null;
    }
    initialize() {
        super.initialize();
        this._generator = this.random_generator?.generator() ?? new SystemRandom();
    }
    v_compute(xs0) {
        const xs = (() => {
            if (this.range instanceof FactorRange)
                return this.range.v_synthetic(xs0);
            else
                return xs0;
        })();
        const offsets = (() => {
            const xs_length = xs.length;
            if (this._previous_offsets?.length != xs_length) {
                this._previous_offsets = this._v_compute(xs_length);
            }
            return this._previous_offsets;
        })();
        return map(offsets, (offset, i) => offset + xs[i]);
    }
    _compute() {
        const { mean, width } = this;
        switch (this.distribution) {
            case "uniform": return this._generator.uniform(mean, width);
            case "normal": return this._generator.normal(mean, width);
        }
    }
    _v_compute(n) {
        const { mean, width } = this;
        switch (this.distribution) {
            case "uniform": return this._generator.uniforms(mean, width, n);
            case "normal": return this._generator.normals(mean, width, n);
        }
    }
}
_a = Jitter;
Jitter.__name__ = "Jitter";
(() => {
    _a.define(({ Number }) => ({
        mean: [Number, 0],
        width: [Number, 1],
        distribution: [Distribution, "uniform"],
    }));
    _a.internal(({ Nullable, Ref }) => ({
        random_generator: [Nullable(Ref(RandomGenerator)), null],
    }));
})();
//# sourceMappingURL=jitter.js.map