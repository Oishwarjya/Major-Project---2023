import * as tp from "./util/types";
import { is_Color } from "./util/color";
import { keys, entries } from "./util/object";
const ESMap = globalThis.Map;
const ESSet = globalThis.Set;
const { hasOwnProperty } = Object.prototype;
export class Kind {
}
Kind.__name__ = "Kind";
export var Kinds;
(function (Kinds) {
    var _a;
    class Any extends Kind {
        constructor() {
            super(...arguments);
            this[_a] = "Any";
        }
        valid(_value) {
            return true;
        }
        toString() {
            return "Any";
        }
    }
    _a = Symbol.toStringTag;
    Any.__name__ = "Any";
    Kinds.Any = Any;
    class Unknown extends Kind {
        valid(_value) {
            return true;
        }
        toString() {
            return "Unknown";
        }
    }
    Unknown.__name__ = "Unknown";
    Kinds.Unknown = Unknown;
    class Boolean extends Kind {
        valid(value) {
            return tp.isBoolean(value);
        }
        toString() {
            return "Boolean";
        }
    }
    Boolean.__name__ = "Boolean";
    Kinds.Boolean = Boolean;
    class Ref extends Kind {
        constructor(obj_type) {
            super();
            this.obj_type = obj_type;
        }
        valid(value) {
            return value instanceof this.obj_type;
        }
        toString() {
            const tp = this.obj_type;
            // NOTE: `__name__` is injected by a compiler transform
            const name = tp.__name__ ?? tp.toString();
            return `Ref(${name})`;
        }
    }
    Ref.__name__ = "Ref";
    Kinds.Ref = Ref;
    class AnyRef extends Kind {
        valid(value) {
            return tp.isObject(value);
        }
        toString() {
            return "AnyRef";
        }
    }
    AnyRef.__name__ = "AnyRef";
    Kinds.AnyRef = AnyRef;
    class Number extends Kind {
        valid(value) {
            return tp.isNumber(value);
        }
        toString() {
            return "Number";
        }
    }
    Number.__name__ = "Number";
    Kinds.Number = Number;
    class Int extends Number {
        valid(value) {
            return super.valid(value) && tp.isInteger(value);
        }
        toString() {
            return "Int";
        }
    }
    Int.__name__ = "Int";
    Kinds.Int = Int;
    class Percent extends Number {
        valid(value) {
            return super.valid(value) && 0 <= value && value <= 1;
        }
        toString() {
            return "Percent";
        }
    }
    Percent.__name__ = "Percent";
    Kinds.Percent = Percent;
    class Or extends Kind {
        constructor(types) {
            super();
            this.types = types;
            this.types = types;
        }
        valid(value) {
            return this.types.some((type) => type.valid(value));
        }
        toString() {
            return `Or(${this.types.map((type) => type.toString()).join(", ")})`;
        }
    }
    Or.__name__ = "Or";
    Kinds.Or = Or;
    class Tuple extends Kind {
        constructor(types) {
            super();
            this.types = types;
            this.types = types;
        }
        valid(value) {
            if (!tp.isArray(value))
                return false;
            for (let i = 0; i < this.types.length; i++) {
                const type = this.types[i];
                const item = value[i];
                if (!type.valid(item))
                    return false;
            }
            return true;
        }
        toString() {
            return `Tuple(${this.types.map((type) => type.toString()).join(", ")})`;
        }
    }
    Tuple.__name__ = "Tuple";
    Kinds.Tuple = Tuple;
    class Struct extends Kind {
        constructor(struct_type) {
            super();
            this.struct_type = struct_type;
        }
        valid(value) {
            if (!tp.isPlainObject(value))
                return false;
            const { struct_type } = this;
            for (const key of keys(value)) {
                if (!hasOwnProperty.call(struct_type, key))
                    return false;
            }
            for (const key in struct_type) {
                if (hasOwnProperty.call(struct_type, key)) {
                    const item_type = struct_type[key];
                    const item = value[key];
                    if (!item_type.valid(item))
                        return false;
                }
            }
            return true;
        }
        toString() {
            const items = entries(this.struct_type).map(([key, kind]) => `${key}: ${kind}`).join(", ");
            return `Struct({${items}})`;
        }
    }
    Struct.__name__ = "Struct";
    Kinds.Struct = Struct;
    class Arrayable extends Kind {
        constructor(item_type) {
            super();
            this.item_type = item_type;
        }
        valid(value) {
            return tp.isArray(value) || tp.isTypedArray(value); // TODO: too specific
        }
        toString() {
            return `Arrayable(${this.item_type.toString()})`;
        }
    }
    Arrayable.__name__ = "Arrayable";
    Kinds.Arrayable = Arrayable;
    class Array extends Kind {
        constructor(item_type) {
            super();
            this.item_type = item_type;
        }
        valid(value) {
            return tp.isArray(value) && value.every((item) => this.item_type.valid(item));
        }
        toString() {
            return `Array(${this.item_type.toString()})`;
        }
    }
    Array.__name__ = "Array";
    Kinds.Array = Array;
    class Null extends Kind {
        valid(value) {
            return value === null;
        }
        toString() {
            return "Null";
        }
    }
    Null.__name__ = "Null";
    Kinds.Null = Null;
    class Nullable extends Kind {
        constructor(base_type) {
            super();
            this.base_type = base_type;
        }
        valid(value) {
            return value === null || this.base_type.valid(value);
        }
        toString() {
            return `Nullable(${this.base_type.toString()})`;
        }
    }
    Nullable.__name__ = "Nullable";
    Kinds.Nullable = Nullable;
    class Opt extends Kind {
        constructor(base_type) {
            super();
            this.base_type = base_type;
        }
        valid(value) {
            return value === undefined || this.base_type.valid(value);
        }
        toString() {
            return `Opt(${this.base_type.toString()})`;
        }
    }
    Opt.__name__ = "Opt";
    Kinds.Opt = Opt;
    class Bytes extends Kind {
        valid(value) {
            return value instanceof ArrayBuffer;
        }
        toString() {
            return "Bytes";
        }
    }
    Bytes.__name__ = "Bytes";
    Kinds.Bytes = Bytes;
    class String extends Kind {
        valid(value) {
            return tp.isString(value);
        }
        toString() {
            return "String";
        }
    }
    String.__name__ = "String";
    Kinds.String = String;
    class Regex extends String {
        constructor(regex) {
            super();
            this.regex = regex;
        }
        valid(value) {
            return super.valid(value) && this.regex.test(value);
        }
        toString() {
            return `Regex(${this.regex.toString()})`;
        }
    }
    Regex.__name__ = "Regex";
    Kinds.Regex = Regex;
    class Enum extends Kind {
        constructor(values) {
            super();
            this.values = new ESSet(values);
        }
        valid(value) {
            return this.values.has(value);
        }
        *[Symbol.iterator]() {
            yield* this.values;
        }
        toString() {
            return `Enum(${[...this.values].map((v) => v.toString()).join(", ")})`;
        }
    }
    Enum.__name__ = "Enum";
    Kinds.Enum = Enum;
    class Dict extends Kind {
        constructor(item_type) {
            super();
            this.item_type = item_type;
        }
        valid(value) {
            if (!tp.isPlainObject(value))
                return false;
            for (const key in value) {
                if (hasOwnProperty.call(value, key)) {
                    const item = value[key];
                    if (!this.item_type.valid(item))
                        return false;
                }
            }
            return true;
        }
        toString() {
            return `Dict(${this.item_type.toString()})`;
        }
    }
    Dict.__name__ = "Dict";
    Kinds.Dict = Dict;
    class Map extends Kind {
        constructor(key_type, item_type) {
            super();
            this.key_type = key_type;
            this.item_type = item_type;
        }
        valid(value) {
            if (!(value instanceof ESMap))
                return false;
            for (const [key, item] of value.entries()) {
                if (!(this.key_type.valid(key) && this.item_type.valid(item)))
                    return false;
            }
            return true;
        }
        toString() {
            return `Map(${this.key_type.toString()}, ${this.item_type.toString()})`;
        }
    }
    Map.__name__ = "Map";
    Kinds.Map = Map;
    class Set extends Kind {
        constructor(item_type) {
            super();
            this.item_type = item_type;
        }
        valid(value) {
            if (!(value instanceof ESSet))
                return false;
            for (const item of value) {
                if (!this.item_type.valid(item))
                    return false;
            }
            return true;
        }
        toString() {
            return `Set(${this.item_type.toString()})`;
        }
    }
    Set.__name__ = "Set";
    Kinds.Set = Set;
    class Color extends Kind {
        valid(value) {
            return is_Color(value);
        }
        toString() {
            return "Color";
        }
    }
    Color.__name__ = "Color";
    Kinds.Color = Color;
    class CSSLength extends String {
        /*
        override valid(value: unknown): value is string {
          return super.valid(value) // TODO: && this._parse(value)
        }
        */
        toString() {
            return "CSSLength";
        }
    }
    CSSLength.__name__ = "CSSLength";
    Kinds.CSSLength = CSSLength;
    class Function extends Kind {
        valid(value) {
            return tp.isFunction(value);
        }
        toString() {
            return "Function(...)";
        }
    }
    Function.__name__ = "Function";
    Kinds.Function = Function;
    class NonNegative extends Kind {
        constructor(base_type) {
            super();
            this.base_type = base_type;
        }
        valid(value) {
            return this.base_type.valid(value) && value >= 0;
        }
        toString() {
            return `NonNegative(${this.base_type.toString()})`;
        }
    }
    NonNegative.__name__ = "NonNegative";
    Kinds.NonNegative = NonNegative;
    class Positive extends Kind {
        constructor(base_type) {
            super();
            this.base_type = base_type;
        }
        valid(value) {
            return this.base_type.valid(value) && value > 0;
        }
        toString() {
            return `Positive(${this.base_type.toString()})`;
        }
    }
    Positive.__name__ = "Positive";
    Kinds.Positive = Positive;
    class DOMNode extends Kind {
        valid(value) {
            return value instanceof Node;
        }
        toString() {
            return "DOMNode";
        }
    }
    DOMNode.__name__ = "DOMNode";
    Kinds.DOMNode = DOMNode;
})(Kinds || (Kinds = {}));
export const Any = new Kinds.Any();
export const Unknown = new Kinds.Unknown();
export const Boolean = new Kinds.Boolean();
export const Number = new Kinds.Number();
export const Int = new Kinds.Int();
export const Bytes = new Kinds.Bytes();
export const String = new Kinds.String();
export const Regex = (regex) => new Kinds.Regex(regex);
export const Null = new Kinds.Null();
export const Nullable = (base_type) => new Kinds.Nullable(base_type);
export const Opt = (base_type) => new Kinds.Opt(base_type);
export const Or = (...types) => new Kinds.Or(types);
export const Tuple = (...types) => new Kinds.Tuple(types);
export const Struct = (struct_type) => new Kinds.Struct(struct_type);
export const Arrayable = (item_type) => new Kinds.Arrayable(item_type);
export const Array = (item_type) => new Kinds.Array(item_type);
export const Dict = (item_type) => new Kinds.Dict(item_type);
export const Map = (key_type, item_type) => new Kinds.Map(key_type, item_type);
export const Set = (item_type) => new Kinds.Set(item_type);
export const Enum = (...values) => new Kinds.Enum(values);
export const Ref = (obj_type) => new Kinds.Ref(obj_type);
export const AnyRef = () => new Kinds.AnyRef();
export const Function = () => new Kinds.Function();
export const DOMNode = new Kinds.DOMNode();
export const NonNegative = (base_type) => new Kinds.NonNegative(base_type);
export const Positive = (base_type) => new Kinds.Positive(base_type);
export const Percent = new Kinds.Percent();
export const Alpha = Percent;
export const Color = new Kinds.Color();
export const Auto = Enum("auto");
export const CSSLength = new Kinds.CSSLength();
export const FontSize = String;
export const Font = String;
export const Angle = Number;
//# sourceMappingURL=kinds.js.map