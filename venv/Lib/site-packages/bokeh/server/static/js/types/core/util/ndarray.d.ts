import { NDDataType } from "../types";
import { equals, Equatable, Comparator } from "./eq";
import { serialize, Serializable, Serializer } from "../serialization";
declare const __ndarray__: unique symbol;
export interface NDArrayType extends Equatable, Serializable {
    readonly [__ndarray__]: boolean;
    readonly dtype: NDDataType;
    readonly shape: number[];
    readonly dimension: number;
}
declare type Init<T> = number | ArrayBuffer | ArrayLike<T>;
export declare class BoolNDArray extends Uint8Array implements NDArrayType {
    readonly [__ndarray__] = true;
    readonly dtype: "bool";
    readonly shape: number[];
    readonly dimension: number;
    constructor(init: Init<number>, shape?: number[]);
    [equals](that: this, cmp: Comparator): boolean;
    [serialize](serializer: Serializer): unknown;
}
export declare class Uint8NDArray extends Uint8Array implements NDArrayType {
    readonly [__ndarray__] = true;
    readonly dtype: "uint8";
    readonly shape: number[];
    readonly dimension: number;
    constructor(init: Init<number>, shape?: number[]);
    [equals](that: this, cmp: Comparator): boolean;
    [serialize](serializer: Serializer): unknown;
}
export declare class Int8NDArray extends Int8Array implements NDArrayType {
    readonly [__ndarray__] = true;
    readonly dtype: "int8";
    readonly shape: number[];
    readonly dimension: number;
    constructor(init: Init<number>, shape?: number[]);
    [equals](that: this, cmp: Comparator): boolean;
    [serialize](serializer: Serializer): unknown;
}
export declare class Uint16NDArray extends Uint16Array implements NDArrayType {
    readonly [__ndarray__] = true;
    readonly dtype: "uint16";
    readonly shape: number[];
    readonly dimension: number;
    constructor(init: Init<number>, shape?: number[]);
    [equals](that: this, cmp: Comparator): boolean;
    [serialize](serializer: Serializer): unknown;
}
export declare class Int16NDArray extends Int16Array implements NDArrayType {
    readonly [__ndarray__] = true;
    readonly dtype: "int16";
    readonly shape: number[];
    readonly dimension: number;
    constructor(init: Init<number>, shape?: number[]);
    [equals](that: this, cmp: Comparator): boolean;
    [serialize](serializer: Serializer): unknown;
}
export declare class Uint32NDArray extends Uint32Array implements NDArrayType {
    readonly [__ndarray__] = true;
    readonly dtype: "uint32";
    readonly shape: number[];
    readonly dimension: number;
    constructor(init: Init<number>, shape?: number[]);
    [equals](that: this, cmp: Comparator): boolean;
    [serialize](serializer: Serializer): unknown;
}
export declare class Int32NDArray extends Int32Array implements NDArrayType {
    readonly [__ndarray__] = true;
    readonly dtype: "int32";
    readonly shape: number[];
    readonly dimension: number;
    constructor(init: Init<number>, shape?: number[]);
    [equals](that: this, cmp: Comparator): boolean;
    [serialize](serializer: Serializer): unknown;
}
export declare class Float32NDArray extends Float32Array implements NDArrayType {
    readonly [__ndarray__] = true;
    readonly dtype: "float32";
    readonly shape: number[];
    readonly dimension: number;
    constructor(init: Init<number>, shape?: number[]);
    [equals](that: this, cmp: Comparator): boolean;
    [serialize](serializer: Serializer): unknown;
}
export declare class Float64NDArray extends Float64Array implements NDArrayType {
    readonly [__ndarray__] = true;
    readonly dtype: "float64";
    readonly shape: number[];
    readonly dimension: number;
    constructor(init: Init<number>, shape?: number[]);
    [equals](that: this, cmp: Comparator): boolean;
    [serialize](serializer: Serializer): unknown;
}
export declare class ObjectNDArray extends Array implements NDArrayType {
    readonly [__ndarray__] = true;
    readonly dtype: "object";
    readonly shape: number[];
    readonly dimension: number;
    constructor(init_: Init<unknown>, shape?: number[]);
    [equals](that: this, cmp: Comparator): boolean;
    [serialize](serializer: Serializer): unknown;
}
export declare type NDArray = BoolNDArray | Uint8NDArray | Int8NDArray | Uint16NDArray | Int16NDArray | Uint32NDArray | Int32NDArray | Float32NDArray | Float64NDArray | ObjectNDArray;
export declare function is_NDArray(v: unknown): v is NDArray;
export declare type NDArrayTypes = {
    bool: {
        array: Uint8Array;
        ndarray: BoolNDArray;
    };
    uint8: {
        array: Uint8Array;
        ndarray: Uint8NDArray;
    };
    int8: {
        array: Int8Array;
        ndarray: Int8NDArray;
    };
    uint16: {
        array: Uint16Array;
        ndarray: Uint16NDArray;
    };
    int16: {
        array: Int16Array;
        ndarray: Int16NDArray;
    };
    uint32: {
        array: Uint32Array;
        ndarray: Uint32NDArray;
    };
    int32: {
        array: Int32Array;
        ndarray: Int32NDArray;
    };
    float32: {
        array: Float32Array;
        ndarray: Float32NDArray;
    };
    float64: {
        array: Float64Array;
        ndarray: Float64NDArray;
    };
    object: {
        array: unknown[];
        ndarray: ObjectNDArray;
    };
};
declare type ArrayNd<S extends number[]> = {
    dimension: S["length"];
    shape: S;
};
declare type Array1d = ArrayNd<[number]>;
declare type Array2d = ArrayNd<[number, number]>;
export declare type Uint32Array1d = Uint32NDArray & Array1d;
export declare type Uint8Array1d = Uint8NDArray & Array1d;
export declare type Uint8Array2d = Uint8NDArray & Array2d;
export declare type Float32Array2d = Float32NDArray & Array2d;
export declare type Float64Array2d = Float64NDArray & Array2d;
export declare type FloatArray2d = Float32Array2d | Float64Array2d;
export declare function ndarray<S extends number[]>(init: number | ArrayBuffer | ArrayLike<unknown>, options?: {
    shape?: S;
}): NDArrayTypes["object"]["ndarray"] & ArrayNd<S>;
export declare function ndarray<K extends NDDataType, S extends number[]>(init: number | ArrayBuffer | ArrayLike<number>, options?: {
    dtype: K;
    shape?: S;
}): NDArrayTypes[K]["ndarray"] & ArrayNd<S>;
export declare function ndarray<S extends number[]>(init: ArrayLike<unknown>, options?: {
    dtype: "object";
    shape?: S;
}): NDArrayTypes["object"]["ndarray"] & ArrayNd<S>;
export {};
//# sourceMappingURL=ndarray.d.ts.map