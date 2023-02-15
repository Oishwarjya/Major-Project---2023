var _a;
import { concat, union } from "./array";
const { hasOwnProperty } = Object.prototype;
export const { keys, values, entries, assign, fromEntries: to_object } = Object;
export const extend = assign;
export function fields(obj) {
    return keys(obj);
}
export function clone(obj) {
    return { ...obj };
}
export function merge(obj1, obj2) {
    /*
     * Returns an object with the array values for obj1 and obj2 unioned by key.
     */
    const result = Object.create(Object.prototype);
    const keys = concat([Object.keys(obj1), Object.keys(obj2)]);
    for (const key of keys) {
        const arr1 = hasOwnProperty.call(obj1, key) ? obj1[key] : [];
        const arr2 = hasOwnProperty.call(obj2, key) ? obj2[key] : [];
        result[key] = union(arr1, arr2);
    }
    return result;
}
export function size(obj) {
    return Object.keys(obj).length;
}
export function is_empty(obj) {
    return size(obj) == 0;
}
export class Dict {
    constructor(obj) {
        this.obj = obj;
        this[_a] = "Dict";
    }
    clear() {
        for (const key of keys(this.obj)) {
            delete this.obj[key];
        }
    }
    delete(key) {
        const had = key in this;
        delete this.obj[key];
        return had;
    }
    get(key) {
        return key in this.obj ? this.obj[key] : undefined;
    }
    has(key) {
        return key in this.obj;
    }
    set(key, value) {
        this.obj[key] = value;
        return this;
    }
    get size() {
        return size(this.obj);
    }
    get is_empty() {
        return this.size == 0;
    }
    [(_a = Symbol.toStringTag, Symbol.iterator)]() {
        return this.entries();
    }
    *keys() {
        yield* keys(this.obj);
    }
    *values() {
        yield* values(this.obj);
    }
    *entries() {
        yield* entries(this.obj);
    }
    forEach(callback, that) {
        for (const [key, value] of this.entries()) {
            callback.call(that, value, key, this);
        }
    }
}
Dict.__name__ = "Dict";
export function dict(o) {
    return new Dict(o);
}
//# sourceMappingURL=object.js.map