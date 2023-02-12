import { type HasProps } from "../core/has_props";
import { Deserializer } from "../core/serialization/deserializer";
import { Ref } from "../core/util/refs";
export declare type ModelDef = {
    type: "model";
    name: string;
    extends?: Ref;
    properties?: PropertyDef[];
    overrides?: OverrideDef[];
};
export declare type PrimitiveKindRef = "Any" | "Unknown" | "Boolean" | "Number" | "Int" | "Bytes" | "String" | "Null";
export declare type KindRef = PrimitiveKindRef | [
    "Regex",
    string,
    string?
] | [
    "Nullable",
    KindRef
] | [
    "Or",
    KindRef,
    ...KindRef[]
] | [
    "Tuple",
    KindRef,
    ...KindRef[]
] | [
    "Array",
    KindRef
] | [
    "Struct",
    ...([string, KindRef][])
] | [
    "Dict",
    KindRef
] | [
    "Map",
    KindRef,
    KindRef
] | [
    "Enum",
    ...string[]
] | [
    "Ref",
    Ref
] | [
    "AnyRef"
];
export declare type PropertyDef = {
    name: string;
    kind: KindRef;
    default?: unknown;
};
export declare type OverrideDef = {
    name: string;
    default: unknown;
};
export declare function decode_def(def: ModelDef, deserializer: Deserializer): typeof HasProps;
//# sourceMappingURL=defs.d.ts.map