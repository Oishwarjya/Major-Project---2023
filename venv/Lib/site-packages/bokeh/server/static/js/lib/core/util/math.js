import { isObject } from "./types";
import { assert } from "./assert";
const { PI, abs, sign } = Math;
export function angle_norm(angle) {
    if (angle == 0) {
        return 0;
    }
    while (angle <= 0) {
        angle += 2 * PI;
    }
    while (angle > 2 * PI) {
        angle -= 2 * PI;
    }
    return angle;
}
export function angle_dist(lhs, rhs) {
    return angle_norm(lhs - rhs);
}
export function angle_between(mid, lhs, rhs, anticlock = false) {
    const d = angle_dist(lhs, rhs);
    if (d == 0)
        return false;
    if (d == 2 * PI)
        return true;
    const norm_mid = angle_norm(mid);
    const cond = angle_dist(lhs, norm_mid) <= d && angle_dist(norm_mid, rhs) <= d;
    return !anticlock ? cond : !cond;
}
export function randomIn(min, max) {
    if (max == null) {
        max = min;
        min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
}
export function atan2(start, end) {
    /*
     * Calculate the angle between a line containing start and end points (composed
     * of [x, y] arrays) and the positive x-axis.
     */
    return Math.atan2(end[1] - start[1], end[0] - start[0]);
}
export function radians(degrees) {
    return degrees * (PI / 180);
}
export function degrees(radians) {
    return radians / (PI / 180);
}
export function resolve_angle(angle, units) {
    /** Convert CCW angle with units to CW radians (canvas). */
    return -to_radians_coeff(units) * angle;
}
export function to_radians_coeff(units) {
    switch (units) {
        case "deg": return PI / 180;
        case "rad": return 1;
        case "grad": return PI / 200;
        case "turn": return 2 * PI;
    }
}
export function clamp(val, min, max) {
    return val < min ? min : (val > max ? max : val);
}
export function log(x, base = Math.E) {
    return Math.log(x) / Math.log(base);
}
export function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b != 0) {
        [a, b] = [b, a % b];
    }
    return a;
}
export function lcm(a, ...rest) {
    for (const b of rest) {
        a = Math.floor((a * b) / gcd(a, b));
    }
    return a;
}
export const float = Symbol("float");
export function is_Floating(obj) {
    return isObject(obj) && float in obj;
}
export class Fraction {
    constructor(numer, denom) {
        assert(denom != 0, "Zero divisor");
        const div = gcd(numer, denom);
        const sgn = sign(numer) * sign(denom);
        this.numer = sgn * abs(numer) / div;
        this.denom = abs(denom) / div;
    }
    [float]() {
        return this.numer / this.denom;
    }
    toString() {
        return `${this.numer}/${this.denom}`;
    }
}
Fraction.__name__ = "Fraction";
export const float32_epsilon = 1.1920928955078125e-7; // IEEE-754
export function factorial(x) {
    let y = 1;
    for (let i = 2; i <= x; i++) {
        y *= i;
    }
    return y;
}
export function hermite(n) {
    const poly = new Array(n + 1);
    poly.fill(0);
    const fn = factorial(n);
    for (let k = 0; k <= Math.floor(n / 2); k++) {
        const c = (-1) ** k * fn / (factorial(k) * factorial(n - 2 * k)) * 2 ** (n - 2 * k);
        poly[2 * k] = c;
    }
    return poly;
}
export function eval_poly(poly, x) {
    const n = poly.length - 1;
    let y = 0;
    let x_n = 1;
    for (let i = n; i >= 0; i--) {
        y += x_n * poly[i];
        x_n *= x;
    }
    return y;
}
//# sourceMappingURL=math.js.map