//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
const toString = Object.prototype.toString;
export function is_undefined(obj) {
    return typeof obj === "undefined";
}
export function is_defined(obj) {
    return typeof obj !== "undefined";
}
// XXX: use only to work around strict conditional expressions
export function is_nullish(obj) {
    return obj == null;
}
export function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === "[object Boolean]";
}
export function isNumber(obj) {
    return toString.call(obj) === "[object Number]";
}
export function isInteger(obj) {
    return isNumber(obj) && Number.isInteger(obj);
}
export function isString(obj) {
    return toString.call(obj) === "[object String]";
}
export function isSymbol(obj) {
    return typeof obj === "symbol";
}
export function isPrimitive(obj) {
    return obj === null || isBoolean(obj) || isNumber(obj) || isString(obj) || isSymbol(obj);
}
export function isFunction(obj) {
    const rep = toString.call(obj);
    return rep === "[object Function]" || rep === "[object AsyncFunction]";
}
export function isArray(obj) {
    return Array.isArray(obj);
}
export function isArrayOf(array, predicate) {
    for (const item of array) {
        if (!predicate(item))
            return false;
    }
    return true;
}
export function isArrayableOf(array, predicate) {
    for (const item of array) {
        if (!predicate(item))
            return false;
    }
    return true;
}
export function isTypedArray(obj) {
    return ArrayBuffer.isView(obj) && !(obj instanceof DataView);
}
export function isObject(obj) {
    const tp = typeof obj;
    return tp === "function" || tp === "object" && !!obj;
}
export function isBasicObject(obj) {
    return isObject(obj) && is_nullish(obj.constructor);
}
export function isPlainObject(obj) {
    return isObject(obj) && (is_nullish(obj.constructor) || obj.constructor === Object);
}
export function isIterable(obj) {
    return isObject(obj) && Symbol.iterator in obj;
}
export function isArrayable(obj) {
    return isIterable(obj) && "length" in obj;
}
//# sourceMappingURL=types.js.map