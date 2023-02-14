import { ByteOrder, DataType, NDDataType } from "../types";
import { Ref } from "../util/refs";
import { Buffer } from "./buffer";
export declare type AnyVal = null | boolean | number | string | Ref | AnyRep | AnyVal[] | {
    [key: string]: AnyVal;
};
export declare type AnyRep = SymbolRep | NumberRep | ArrayRep | SetRep | MapRep | BytesRep | TypedArrayRep | NDArrayRep | ObjectRep | ObjectRefRep;
export declare type SymbolRep = {
    type: "symbol";
    name: string;
};
export declare type NumberRep = {
    type: "number";
    value: number | "nan" | "-inf" | "+inf";
};
export declare type ArrayRep = {
    type: "array";
    entries?: AnyVal[];
};
export declare type SetRep = {
    type: "set";
    entries?: AnyVal[];
};
export declare type MapRep = {
    type: "map";
    entries?: [AnyVal, AnyVal][];
};
export declare type BytesRep = {
    type: "bytes";
    data: Bytes;
};
export declare type Bytes = Ref | string | Buffer;
export declare type SliceRep = {
    type: "slice";
    start: number | null;
    stop: number | null;
    step: number | null;
};
export declare type ValueRep = {
    type: "value";
    value: AnyVal;
    transform?: AnyVal;
    units?: AnyVal;
};
export declare type FieldRep = {
    type: "field";
    field: string;
    transform?: AnyVal;
    units?: AnyVal;
};
export declare type ExprRep = {
    type: "expr";
    expr: AnyVal;
    transform?: AnyVal;
    units?: AnyVal;
};
export declare type ObjectRep = {
    type: "object";
    name: string;
    attributes?: {
        [key: string]: AnyVal;
    };
};
export declare type ObjectRefRep = {
    type: "object";
    name: string;
    id: string;
    attributes?: {
        [key: string]: AnyVal;
    };
};
export declare type ModelRep = ObjectRefRep;
export declare type TypedArrayRep = {
    type: "typed_array";
    array: BytesRep;
    order: ByteOrder;
    dtype: DataType;
};
export declare type Shape = number[];
export declare type NDArrayRep = {
    type: "ndarray";
    array: BytesRep | ArrayRep;
    order: ByteOrder;
    dtype: NDDataType;
    shape: Shape;
};
//# sourceMappingURL=reps.d.ts.map