import { is_ref } from "../util/refs";
import { ndarray } from "../util/ndarray";
import { entries, Dict } from "../util/object";
import { map, every } from "../util/array";
import { BYTE_ORDER } from "../util/platform";
import { base64_to_buffer, swap } from "../util/buffer";
import { isArray, isPlainObject, isString, isNumber } from "../util/types";
import { Slice } from "../util/slice";
const _decoders = new Map();
export class DeserializationError extends Error {
}
DeserializationError.__name__ = "DeserializationError";
export class Deserializer {
    constructor(resolver, references = new Map(), finalize) {
        this.resolver = resolver;
        this.references = references;
        this.finalize = finalize;
        this._decoding = false;
        this._buffers = new Map();
        this._finalizable = new Set();
    }
    static register(type, decoder) {
        if (!_decoders.has(type))
            _decoders.set(type, decoder);
        else
            throw new Error(`'${type}' already registered for decoding`);
    }
    decode(obj /*AnyVal*/, buffers) {
        if (buffers != null) {
            for (const [id, buffer] of buffers) {
                this._buffers.set(id, buffer);
            }
        }
        if (this._decoding) {
            return this._decode(obj);
        }
        this._decoding = true;
        let finalizable;
        const decoded = (() => {
            try {
                return this._decode(obj);
            }
            finally {
                finalizable = new Set(this._finalizable);
                this._decoding = false;
                this._buffers.clear();
                this._finalizable.clear();
            }
        })();
        for (const instance of finalizable) {
            this.finalize?.(instance);
            instance.finalize();
        }
        // `connect_signals` has to be executed last because it may rely on properties
        // of dependencies that are initialized only in `finalize`. It's a problem
        // that appears when there are circular references, e.g. as in
        // CDS -> CustomJS (on data change) -> GlyphRenderer (in args) -> CDS.
        for (const instance of finalizable) {
            instance.connect_signals();
        }
        return decoded;
    }
    _decode(obj /*AnyVal*/) {
        if (isArray(obj)) {
            return this._decode_plain_array(obj);
        }
        else if (isPlainObject(obj)) {
            if (isString(obj.type)) {
                const decoder = _decoders.get(obj.type);
                if (decoder != null) {
                    return decoder(obj, this);
                }
                switch (obj.type) {
                    case "ref":
                        return this._decode_ref(obj);
                    case "symbol":
                        return this._decode_symbol(obj);
                    case "number":
                        return this._decode_number(obj);
                    case "array":
                        return this._decode_array(obj);
                    case "set":
                        return this._decode_set(obj);
                    case "map":
                        return this._decode_map(obj);
                    case "bytes":
                        return this._decode_bytes(obj);
                    case "slice":
                        return this._decode_slice(obj);
                    case "value":
                        return this._decode_value(obj);
                    case "field":
                        return this._decode_field(obj);
                    case "expr":
                        return this._decode_expr(obj);
                    case "typed_array":
                        return this._decode_typed_array(obj);
                    case "ndarray":
                        return this._decode_ndarray(obj);
                    case "object": {
                        if (isString(obj.id)) {
                            return this._decode_object_ref(obj);
                        }
                        else {
                            return this._decode_object(obj);
                        }
                    }
                    default: {
                        this.error(`unable to decode an object of type '${obj.type}'`);
                    }
                }
            }
            else if (isString(obj.id)) {
                return this._decode_ref(obj);
            }
            else {
                return this._decode_plain_object(obj);
            }
        }
        else
            return obj;
    }
    _decode_symbol(obj) {
        this.error(`can't resolve named symbol '${obj.name}'`); // TODO: implement symbol resolution
    }
    _decode_number(obj) {
        if ("value" in obj) {
            const { value } = obj;
            if (isString(value)) {
                switch (value) {
                    case "nan": return NaN;
                    case "+inf": return +Infinity;
                    case "-inf": return -Infinity;
                }
            }
            else if (isNumber(value))
                return value;
        }
        this.error(`invalid number representation '${obj}'`);
    }
    _decode_plain_array(obj) {
        return map(obj, (item) => this._decode(item));
    }
    _decode_plain_object(obj) {
        const decoded = {};
        for (const [key, val] of entries(obj)) {
            decoded[key] = this._decode(val);
        }
        return decoded;
    }
    _decode_array(obj) {
        const decoded = [];
        for (const entry of obj.entries ?? []) {
            decoded.push(this._decode(entry));
        }
        return decoded;
    }
    _decode_set(obj) {
        const decoded = new Set();
        for (const entry of obj.entries ?? []) {
            decoded.add(this._decode(entry));
        }
        return decoded;
    }
    _decode_map(obj) {
        const decoded = map(obj.entries ?? [], ([key, val]) => [this._decode(key), this._decode(val)]);
        const is_str = every(decoded, ([key]) => isString(key));
        if (is_str) {
            const obj = {}; // Object.create(null)
            for (const [key, val] of decoded) {
                obj[key] = val;
            }
            return obj;
        }
        else
            return new Map(decoded);
    }
    _decode_bytes(obj) {
        const { data } = obj;
        if (is_ref(data)) {
            const buffer = this._buffers.get(data.id);
            if (buffer != null)
                return buffer;
            else
                this.error(`buffer for id=${data.id} not found`);
        }
        else if (isString(data))
            return base64_to_buffer(data);
        else
            return data.buffer;
    }
    _decode_slice(obj) {
        const start = this._decode(obj.start);
        const stop = this._decode(obj.stop);
        const step = this._decode(obj.step);
        return new Slice({ start, stop, step });
    }
    _decode_value(obj) {
        const value = this._decode(obj.value);
        const transform = obj.transform != null ? this._decode(obj.transform) : undefined;
        const units = obj.units != null ? this._decode(obj.units) : undefined;
        return { value, transform, units };
    }
    _decode_field(obj) {
        const field = this._decode(obj.field);
        const transform = obj.transform != null ? this._decode(obj.transform) : undefined;
        const units = obj.units != null ? this._decode(obj.units) : undefined;
        return { field, transform, units };
    }
    _decode_expr(obj) {
        const expr = this._decode(obj.expr);
        const transform = obj.transform != null ? this._decode(obj.transform) : undefined;
        const units = obj.units != null ? this._decode(obj.units) : undefined;
        return { expr, transform, units };
    }
    _decode_typed_array(obj) {
        const { array, order, dtype } = obj;
        const buffer = this._decode(array);
        if (order != BYTE_ORDER) {
            swap(buffer, dtype);
        }
        switch (dtype) {
            case "uint8": return new Uint8Array(buffer);
            case "int8": return new Int8Array(buffer);
            case "uint16": return new Uint16Array(buffer);
            case "int16": return new Int16Array(buffer);
            case "uint32": return new Uint32Array(buffer);
            case "int32": return new Int32Array(buffer);
            // case "uint64": return new BigInt64Array(buffer)
            // case "int64":  return new BigInt64Array(buffer)
            case "float32": return new Float32Array(buffer);
            case "float64": return new Float64Array(buffer);
            default:
                this.error(`unsupported dtype '${dtype}'`);
        }
    }
    _decode_ndarray(obj) {
        const { array, order, dtype, shape } = obj;
        const decoded = this._decode(array);
        if (decoded instanceof ArrayBuffer && order != BYTE_ORDER) {
            swap(decoded, dtype);
        }
        return ndarray(decoded /*XXX*/, { dtype, shape });
    }
    _decode_object(obj) {
        const { type, attributes } = obj;
        const cls = this._resolve_type(type);
        if (attributes != null)
            return new cls(this._decode(attributes));
        else
            return new cls();
    }
    _decode_ref(obj) {
        const instance = this.references.get(obj.id);
        if (instance != null)
            return instance;
        else
            this.error(`reference ${obj.id} isn't known`);
    }
    _decode_object_ref(obj) {
        if (this.references.has(obj.id))
            this.error(`reference already known '${obj.id}'`);
        const { id, name: type, attributes } = obj;
        const cls = this._resolve_type(type);
        const instance = new cls({ id });
        this.references.set(id, instance);
        const decoded_attributes = this._decode(attributes ?? {});
        instance.initialize_props(new Dict(decoded_attributes));
        this._finalizable.add(instance);
        return instance;
    }
    error(message) {
        throw new DeserializationError(message);
    }
    _resolve_type(type) {
        const cls = this.resolver.get(type);
        if (cls != null)
            return cls;
        else
            this.error(`could not resolve type '${type}', which could be due to a widget or a custom model not being registered before first usage`);
    }
}
Deserializer.__name__ = "Deserializer";
//# sourceMappingURL=deserializer.js.map