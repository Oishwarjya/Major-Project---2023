import { Attrs } from "../types";
export declare type Struct = {
    id: string;
    type: string;
    attributes: Attrs;
};
export declare type Ref = {
    id: string;
};
export declare function is_ref(obj: unknown): obj is Ref;
//# sourceMappingURL=refs.d.ts.map