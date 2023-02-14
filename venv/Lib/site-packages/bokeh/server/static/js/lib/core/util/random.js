const { PI, log, sin, cos, sqrt, floor } = Math;
export const MAX_INT32 = 2147483647;
export class AbstractRandom {
    float() {
        return (this.integer() - 1) / (MAX_INT32 - 1);
    }
    floats(n, a = 0, b = 1) {
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = a + this.float() * (b - a);
        }
        return result;
    }
    choices(n, items) {
        const k = items.length;
        const result = new Array(n);
        for (let i = 0; i < n; i++) {
            result[i] = items[this.integer() % k];
        }
        return result;
    }
    uniform(loc, scale) {
        return loc + (this.float() - 0.5) * scale;
    }
    uniforms(loc, scale, size) {
        return Float64Array.from({ length: size }, () => this.uniform(loc, scale));
    }
    normal(loc, scale) {
        return this.normals(loc, scale, 1)[0];
    }
    normals(loc, scale, size) {
        const [mu, sigma] = [loc, scale];
        const array = new Float64Array(size);
        for (let i = 0; i < size; i += 2) {
            // Box-Muller transform from uniform to normal distribution.
            const u = this.float();
            const v = this.float();
            const common = sqrt(-2.0 * log(u));
            array[i] = mu + sigma * (common * cos(2.0 * PI * v));
            if (i + 1 < size)
                array[i + 1] = mu + sigma * (common * sin(2.0 * PI * v));
        }
        return array;
    }
}
AbstractRandom.__name__ = "AbstractRandom";
export class SystemRandom extends AbstractRandom {
    integer() {
        return floor(Math.random() * MAX_INT32);
    }
}
SystemRandom.__name__ = "SystemRandom";
// Park-Miller LCG
export class LCGRandom extends AbstractRandom {
    constructor(seed) {
        super();
        this._seed = seed % MAX_INT32;
        if (this._seed <= 0)
            this._seed += MAX_INT32 - 1;
    }
    integer() {
        this._seed = (48271 * this._seed) % MAX_INT32;
        return this._seed;
    }
}
LCGRandom.__name__ = "LCGRandom";
export class Random extends LCGRandom {
} // for compatibility
Random.__name__ = "Random";
export const random = new Random(Date.now());
//# sourceMappingURL=random.js.map