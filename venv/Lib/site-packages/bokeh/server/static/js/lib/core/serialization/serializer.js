import { assert } from "../util/assert";
import { entries } from "../util/object";
import { /*isBasicObject, */ isPlainObject, isObject, isArray, isTypedArray, isBoolean, isNumber, isString, isSymbol } from "../util/types";
import { map } from "../util/iterator";
import { BYTE_ORDER } from "../util/platform";
import { Buffer, Base64Buffer } from "./buffer";
// TypedArray?
export const serialize = Symbol("serialize");
function is_Serializable(obj) {
    return isObject(obj) && serialize in obj;
}
export class SerializationError extends Error {
}
SerializationError.__name__ = "SerializationError";
class Serialized {
    constructor(value) {
        this.value = value;
    }
    to_json() {
        return JSON.stringify(this.value);
    }
}
Serialized.__name__ = "Serialized";
export class Serializer {
    constructor(options) {
        this._circular = new WeakSet();
        this.binary = options?.binary ?? false;
        this.include_defaults = options?.include_defaults ?? false;
        const references = options?.references;
        this._references = references != null ? new Map(references) : new Map();
    }
    get_ref(obj) {
        return this._references.get(obj);
    }
    add_ref(obj, ref) {
        assert(!this._references.has(obj));
        this._references.set(obj, ref);
    }
    to_serializable(obj) {
        return new Serialized(this.encode(obj));
    }
    encode(obj) {
        const ref = this.get_ref(obj);
        if (ref != null) {
            return ref;
        }
        if (!isObject(obj)) {
            return this._encode(obj);
        }
        else {
            if (this._circular.has(obj)) {
                this.error("circular reference");
            }
            this._circular.add(obj);
            try {
                return this._encode(obj);
            }
            finally {
                this._circular.delete(obj);
            }
        }
    }
    _encode(obj) {
        if (is_Serializable(obj))
            return obj[serialize](this);
        else if (isArray(obj)) {
            const n = obj.length;
            const result = new Array(n);
            for (let i = 0; i < n; i++) {
                const value = obj[i];
                result[i] = this.encode(value);
            }
            return result;
        }
        else if (isTypedArray(obj)) {
            return this._encode_typed_array(obj);
        }
        else if (obj instanceof ArrayBuffer) {
            const data = this.binary ? new Buffer(obj) : new Base64Buffer(obj);
            return { type: "bytes", data };
        }
        else if (isPlainObject(obj)) {
            const items = entries(obj);
            if (items.length == 0)
                return { type: "map" };
            else
                return { type: "map", entries: [...map(items, ([key, val]) => [this.encode(key), this.encode(val)])] };
            /*
            } else if (isBasicObject(obj)) {
              return {type: "map", entries: [...map(entries(obj), ([key, val]) => [this.encode(key), this.encode(val)])]}
            } else if (isPlainObject(obj)) {
              const result: {[key: string]: unknown} = {}
              for (const [key, value] of entries(obj)) {
                result[key] = this.encode(value)
              }
              return result
            */
        }
        else if (obj === null || isBoolean(obj) || isString(obj)) {
            return obj;
        }
        else if (isNumber(obj)) {
            if (isNaN(obj))
                return { type: "number", value: "nan" };
            else if (!isFinite(obj))
                return { type: "number", value: `${obj < 0 ? "-" : "+"}inf` };
            else
                return obj;
        }
        else if (obj instanceof Set) {
            if (obj.size == 0)
                return { type: "set" };
            else
                return { type: "set", entries: [...map(obj.values(), (val) => this.encode(val))] };
        }
        else if (obj instanceof Map) {
            if (obj.size == 0)
                return { type: "map" };
            else
                return { type: "map", entries: [...map(obj.entries(), ([key, val]) => [this.encode(key), this.encode(val)])] };
        }
        else if (isSymbol(obj) && obj.description != null) {
            return { type: "symbol", name: obj.description };
        }
        else
            throw new SerializationError(`${Object.prototype.toString.call(obj)} is not serializable`);
    }
    encode_struct(struct) {
        const result = {};
        for (const [key, val] of entries(struct)) {
            if (val !== undefined)
                result[key] = this.encode(val);
        }
        return result;
    }
    error(message) {
        throw new SerializationError(message);
    }
    _encode_typed_array(obj) {
        const array = this.encode(obj.buffer);
        const dtype = (() => {
            switch (obj.constructor) {
                case Uint8Array: return "uint8";
                case Int8Array: return "int8";
                case Uint16Array: return "uint16";
                case Int16Array: return "int16";
                case Uint32Array: return "uint32";
                case Int32Array: return "int32";
                // case BigUint64Array: return "uint64"
                // case BigInt64Array: return "int64"
                case Float32Array: return "float32";
                case Float64Array: return "float64";
                default:
                    this.error(`can't serialize typed array of type '${obj[Symbol.toStringTag]}'`);
            }
        })();
        return {
            type: "typed_array",
            array,
            order: BYTE_ORDER,
            dtype,
        };
    }
}
Serializer.__name__ = "Serializer";
//# sourceMappingURL=serializer.js.map