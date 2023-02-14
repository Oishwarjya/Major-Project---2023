export { keys, values, entries, size, extend } from "../core/util/object";
export * from "../core/util/array";
export * from "../core/util/string";
export * from "../core/util/random";
export * from "../core/util/types";
export * from "../core/util/eq";
import { Arrayable } from "../core/types";
import { NDArray } from "../core/util/ndarray";
import { Floating } from "../core/util/math";
export declare type Numerical = number | Floating | Arrayable<number>;
export declare function is_Numerical(x: unknown): x is Numerical;
export declare namespace np {
    export const pi: number;
    export function arange(start: number, end?: number, step?: number): NDArray;
    export function linspace(start: number, end: number, num?: number): NDArray;
    export function mean(x: Arrayable<number>): number;
    export function std(x: Arrayable<number>): number;
    export function sum(x: Arrayable<number>): number;
    export function diff<T extends Arrayable<number>>(x: T): T;
    export function sin<T extends Numerical>(x: T): T;
    export function cos<T extends Numerical>(x: T): T;
    export function exp<T extends Numerical>(x: T): T;
    export function sqrt<T extends Numerical>(x: T): T;
    export function factorial<T extends Numerical>(x: T): T;
    export function hermite(n: number): (x: Numerical) => Numerical;
    export function pos<T extends Numerical>(x: T): T;
    export function neg<T extends Numerical>(x: T): T;
    export function add(x0: number, y0: number): number;
    export function add(x0: Numerical, y0: Numerical): NDArray;
    export function sub(x0: number, y0: number): number;
    export function sub(x0: Numerical, y0: Numerical): NDArray;
    export function mul(x0: number, y0: number): number;
    export function mul(x0: Numerical, y0: Numerical): NDArray;
    export function div(x0: number, y0: number): number;
    export function div(x0: Numerical, y0: Numerical): NDArray;
    export function pow(x0: number, y0: number): number;
    export function pow(x0: Numerical, y0: Numerical): NDArray;
    export function ge(x0: number, y0: number): number;
    export function ge(x0: Numerical, y0: Numerical): NDArray;
    export function le(x0: number, y0: number): number;
    export function le(x0: Numerical, y0: Numerical): NDArray;
    export function gt(x0: number, y0: number): number;
    export function gt(x0: Numerical, y0: Numerical): NDArray;
    export function lt(x0: number, y0: number): number;
    export function lt(x0: Numerical, y0: Numerical): NDArray;
    export function where(condition: NDArray, x0: Numerical, y0: Numerical): NDArray;
    type HistogramOptions = {
        density: boolean;
        bins: Arrayable<number>;
    };
    export function histogram(array: Arrayable<number>, options: HistogramOptions): [NDArray, NDArray];
    export namespace random {
        class RandomGenerator {
            private _random;
            constructor(seed?: number);
            normal(loc: number, scale: number, size: number): NDArray;
        }
        function default_rng(seed?: number): RandomGenerator;
    }
    export {};
}
//# sourceMappingURL=linalg.d.ts.map