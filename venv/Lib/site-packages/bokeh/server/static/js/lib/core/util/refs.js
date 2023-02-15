import { isPlainObject } from "./types";
export function is_ref(obj) {
    return isPlainObject(obj) && "id" in obj && !("type" in obj);
}
//# sourceMappingURL=refs.js.map