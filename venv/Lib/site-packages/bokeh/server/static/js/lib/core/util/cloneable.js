import { entries } from "./object";
import { isPrimitive, isPlainObject, isObject, isArray } from "./types";
export const clone = Symbol("clone");
export function is_Cloneable(obj) {
    return isObject(obj) && clone in obj;
}
export class CloningError extends Error {
}
CloningError.__name__ = "CloningError";
export class Cloner {
    constructor() { }
    clone(obj) {
        if (is_Cloneable(obj)) {
            return obj[clone](this);
        }
        else if (isPrimitive(obj)) {
            return obj;
        }
        else if (isArray(obj)) {
            const n = obj.length;
            const result = new Array(n);
            for (let i = 0; i < n; i++) {
                const value = obj[i];
                result[i] = this.clone(value);
            }
            return result;
        }
        else if (isPlainObject(obj)) {
            const result = {};
            for (const [key, value] of entries(obj)) {
                result[key] = this.clone(value);
            }
            return result;
        }
        else if (obj instanceof Map) {
            return new Map([...obj].map(([k, v]) => [this.clone(k), this.clone(v)]));
        }
        else if (obj instanceof Set) {
            return new Set([...obj].map((v) => this.clone(v)));
        }
        else
            throw new CloningError(`${Object.prototype.toString.call(obj)} is not cloneable`);
    }
}
Cloner.__name__ = "Cloner";
//# sourceMappingURL=cloneable.js.map