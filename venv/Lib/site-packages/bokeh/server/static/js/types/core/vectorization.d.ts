import { Arrayable } from "./types";
import { HasProps } from "./has_props";
import { Signal0 } from "./signaling";
import { ColumnarDataSource } from "../models/sources/columnar_data_source";
export declare type Transform<In, Out> = {
    compute(x: In): Out;
    v_compute(xs: Arrayable<In>): Arrayable<Out>;
    change: Signal0<HasProps>;
};
export declare type ScalarExpression<Out> = {
    compute(source: ColumnarDataSource): Out;
    change: Signal0<HasProps>;
};
export declare type VectorExpression<Out> = {
    v_compute(source: ColumnarDataSource): Arrayable<Out>;
    change: Signal0<HasProps>;
};
export declare type Expression<T> = ScalarExpression<T> | VectorExpression<T>;
import { Serializable } from "./serialization";
export declare type Value<T> = Partial<Serializable> & {
    value: T;
};
export declare type Field = Partial<Serializable> & {
    field: string;
};
export declare type Expr<T> = Partial<Serializable> & {
    expr: Expression<T>;
};
export declare type Scalar<T> = Value<T> & Transformed<T>;
export declare type Vector<T> = (Value<T> | Field | Expr<T>) & Transformed<T>;
export declare type Dimensional<T, U> = T & {
    units?: U;
};
export declare type Transformed<T> = {
    transform?: Transform<unknown, T>;
};
export declare function isValue<T>(obj: unknown): obj is Value<T>;
export declare function isField(obj: unknown): obj is Field;
export declare function isExpr<T>(obj: unknown): obj is Expr<T>;
//# sourceMappingURL=vectorization.d.ts.map