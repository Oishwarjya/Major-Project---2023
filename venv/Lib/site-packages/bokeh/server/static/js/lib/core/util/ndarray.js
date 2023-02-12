var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
import { isObject, isNumber } from "./types";
import { BYTE_ORDER } from "./platform";
import { equals } from "./eq";
import { serialize } from "../serialization";
const __ndarray__ = Symbol("__ndarray__");
function encode_NDArray(array, serializer) {
    const encoded = serializer.encode(array.dtype == "object" ? Array.from(array) : array.buffer);
    return {
        type: "ndarray",
        array: encoded,
        order: BYTE_ORDER,
        dtype: array.dtype,
        shape: array.shape,
    };
}
export class BoolNDArray extends Uint8Array {
    constructor(init, shape) {
        super(init); // XXX: typescript bug?
        this[_a] = true;
        this.dtype = "bool";
        this.shape = shape ?? (is_NDArray(init) ? init.shape : [this.length]);
        this.dimension = this.shape.length;
    }
    [(_a = __ndarray__, equals)](that, cmp) {
        return cmp.eq(this.shape, that.shape) && cmp.arrays(this, that);
    }
    [serialize](serializer) {
        return encode_NDArray(this, serializer);
    }
}
BoolNDArray.__name__ = "BoolNDArray";
export class Uint8NDArray extends Uint8Array {
    constructor(init, shape) {
        super(init); // XXX: typescript bug?
        this[_b] = true;
        this.dtype = "uint8";
        this.shape = shape ?? (is_NDArray(init) ? init.shape : [this.length]);
        this.dimension = this.shape.length;
    }
    [(_b = __ndarray__, equals)](that, cmp) {
        return cmp.eq(this.shape, that.shape) && cmp.arrays(this, that);
    }
    [serialize](serializer) {
        return encode_NDArray(this, serializer);
    }
}
Uint8NDArray.__name__ = "Uint8NDArray";
export class Int8NDArray extends Int8Array {
    constructor(init, shape) {
        super(init); // XXX: typescript bug?
        this[_c] = true;
        this.dtype = "int8";
        this.shape = shape ?? (is_NDArray(init) ? init.shape : [this.length]);
        this.dimension = this.shape.length;
    }
    [(_c = __ndarray__, equals)](that, cmp) {
        return cmp.eq(this.shape, that.shape) && cmp.arrays(this, that);
    }
    [serialize](serializer) {
        return encode_NDArray(this, serializer);
    }
}
Int8NDArray.__name__ = "Int8NDArray";
export class Uint16NDArray extends Uint16Array {
    constructor(init, shape) {
        super(init); // XXX: typescript bug?
        this[_d] = true;
        this.dtype = "uint16";
        this.shape = shape ?? (is_NDArray(init) ? init.shape : [this.length]);
        this.dimension = this.shape.length;
    }
    [(_d = __ndarray__, equals)](that, cmp) {
        return cmp.eq(this.shape, that.shape) && cmp.arrays(this, that);
    }
    [serialize](serializer) {
        return encode_NDArray(this, serializer);
    }
}
Uint16NDArray.__name__ = "Uint16NDArray";
export class Int16NDArray extends Int16Array {
    constructor(init, shape) {
        super(init); // XXX: typescript bug?
        this[_e] = true;
        this.dtype = "int16";
        this.shape = shape ?? (is_NDArray(init) ? init.shape : [this.length]);
        this.dimension = this.shape.length;
    }
    [(_e = __ndarray__, equals)](that, cmp) {
        return cmp.eq(this.shape, that.shape) && cmp.arrays(this, that);
    }
    [serialize](serializer) {
        return encode_NDArray(this, serializer);
    }
}
Int16NDArray.__name__ = "Int16NDArray";
export class Uint32NDArray extends Uint32Array {
    constructor(init, shape) {
        super(init); // XXX: typescript bug?
        this[_f] = true;
        this.dtype = "uint32";
        this.shape = shape ?? (is_NDArray(init) ? init.shape : [this.length]);
        this.dimension = this.shape.length;
    }
    [(_f = __ndarray__, equals)](that, cmp) {
        return cmp.eq(this.shape, that.shape) && cmp.arrays(this, that);
    }
    [serialize](serializer) {
        return encode_NDArray(this, serializer);
    }
}
Uint32NDArray.__name__ = "Uint32NDArray";
export class Int32NDArray extends Int32Array {
    constructor(init, shape) {
        super(init); // XXX: typescript bug?
        this[_g] = true;
        this.dtype = "int32";
        this.shape = shape ?? (is_NDArray(init) ? init.shape : [this.length]);
        this.dimension = this.shape.length;
    }
    [(_g = __ndarray__, equals)](that, cmp) {
        return cmp.eq(this.shape, that.shape) && cmp.arrays(this, that);
    }
    [serialize](serializer) {
        return encode_NDArray(this, serializer);
    }
}
Int32NDArray.__name__ = "Int32NDArray";
export class Float32NDArray extends Float32Array {
    constructor(init, shape) {
        super(init); // XXX: typescript bug?
        this[_h] = true;
        this.dtype = "float32";
        this.shape = shape ?? (is_NDArray(init) ? init.shape : [this.length]);
        this.dimension = this.shape.length;
    }
    [(_h = __ndarray__, equals)](that, cmp) {
        return cmp.eq(this.shape, that.shape) && cmp.arrays(this, that);
    }
    [serialize](serializer) {
        return encode_NDArray(this, serializer);
    }
}
Float32NDArray.__name__ = "Float32NDArray";
export class Float64NDArray extends Float64Array {
    constructor(init, shape) {
        super(init); // XXX: typescript bug?
        this[_j] = true;
        this.dtype = "float64";
        this.shape = shape ?? (is_NDArray(init) ? init.shape : [this.length]);
        this.dimension = this.shape.length;
    }
    [(_j = __ndarray__, equals)](that, cmp) {
        return cmp.eq(this.shape, that.shape) && cmp.arrays(this, that);
    }
    [serialize](serializer) {
        return encode_NDArray(this, serializer);
    }
}
Float64NDArray.__name__ = "Float64NDArray";
export class ObjectNDArray extends Array {
    constructor(init_, shape) {
        const init = init_ instanceof ArrayBuffer ? new Float64Array(init_) : init_;
        const size = isNumber(init) ? init : init.length;
        super(size);
        this[_k] = true;
        this.dtype = "object";
        if (!isNumber(init)) {
            for (let i = 0; i < init.length; i++) {
                this[i] = init[i];
            }
        }
        this.shape = shape ?? (is_NDArray(init) ? init.shape : [this.length]);
        this.dimension = this.shape.length;
    }
    [(_k = __ndarray__, equals)](that, cmp) {
        return cmp.eq(this.shape, that.shape) && cmp.arrays(this, that);
    }
    [serialize](serializer) {
        return encode_NDArray(this, serializer);
    }
}
ObjectNDArray.__name__ = "ObjectNDArray";
export function is_NDArray(v) {
    return isObject(v) && __ndarray__ in v;
}
export function ndarray(init, { dtype, shape } = {}) {
    if (dtype == null) {
        dtype = (() => {
            switch (true) {
                case init instanceof Uint8Array: return "uint8";
                case init instanceof Int8Array: return "int8";
                case init instanceof Uint16Array: return "uint16";
                case init instanceof Int16Array: return "int16";
                case init instanceof Uint32Array: return "uint32";
                case init instanceof Int32Array: return "int32";
                case init instanceof Float32Array: return "float32";
                case init instanceof ArrayBuffer:
                case init instanceof Float64Array: return "float64";
                default: return "object";
            }
        })();
    }
    switch (dtype) {
        case "bool": return new BoolNDArray(init, shape);
        case "uint8": return new Uint8NDArray(init, shape);
        case "int8": return new Int8NDArray(init, shape);
        case "uint16": return new Uint16NDArray(init, shape);
        case "int16": return new Int16NDArray(init, shape);
        case "uint32": return new Uint32NDArray(init, shape);
        case "int32": return new Int32NDArray(init, shape);
        case "float32": return new Float32NDArray(init, shape);
        case "float64": return new Float64NDArray(init, shape);
        case "object": return new ObjectNDArray(init, shape);
    }
}
//# sourceMappingURL=ndarray.js.map