import { Signal0 } from "./signaling";
import { logger } from "./logging";
import * as enums from "./enums";
import { RGBAArray, ColorArray } from "./types";
import { includes, repeat } from "./util/array";
import { mul } from "./util/arrayable";
import { to_radians_coeff } from "./util/math";
import { color2rgba, encode_rgba } from "./util/color";
import { to_big_endian } from "./util/platform";
import { isNumber, isTypedArray, isPlainObject } from "./util/types";
import { isValue, isField, isExpr } from "./vectorization";
import { settings } from "./settings";
import { is_NDArray } from "./util/ndarray";
import { diagnostics } from "./diagnostics";
import { unreachable } from "./util/assert";
import { serialize } from "./serialization";
import { Uniform, UniformScalar, UniformVector, ColorUniformVector } from "./uniforms";
export { Uniform, UniformScalar, UniformVector };
function valueToString(value) {
    try {
        return JSON.stringify(value);
    }
    catch {
        return value.toString();
    }
}
export function isSpec(obj) {
    return isPlainObject(obj) &&
        ((obj.value === undefined ? 0 : 1) +
            (obj.field === undefined ? 0 : 1) +
            (obj.expr === undefined ? 0 : 1) == 1); // garbage JS XOR
}
let global_theme = null;
export function use_theme(theme = null) {
    global_theme = theme;
}
export const unset = Symbol("unset");
export class Property {
    constructor(obj, attr, kind, default_value, options = {}) {
        this.obj = obj;
        this.attr = attr;
        this.kind = kind;
        this.default_value = default_value;
        this._value = unset;
        this._initialized = false;
        this._dirty = false;
        this.change = new Signal0(this.obj, "change");
        this.internal = options.internal ?? false;
        this.convert = options.convert;
        this.on_update = options.on_update;
    }
    get syncable() {
        return !this.internal;
    }
    get is_unset() {
        return this._value === unset;
    }
    get initialized() {
        return this._initialized;
    }
    initialize(initial_value = unset) {
        if (this._initialized)
            throw new Error("already initialized");
        let attr_value = unset;
        if (initial_value !== unset) {
            attr_value = initial_value;
            this._dirty = true;
        }
        else {
            const value = this._default_override();
            if (value !== unset)
                attr_value = value;
            else {
                let themed = false;
                if (global_theme != null) {
                    const value = global_theme.get(this.obj, this.attr);
                    if (value !== undefined) {
                        attr_value = value;
                        themed = true;
                    }
                }
                if (!themed) {
                    attr_value = this.default_value(this.obj);
                }
            }
        }
        if (attr_value !== unset)
            this._update(attr_value);
        else
            this._value = unset;
        this._initialized = true;
    }
    get_value() {
        if (this._value !== unset)
            return this._value;
        else
            throw new Error(`${this.obj}.${this.attr} is unset`);
    }
    set_value(val) {
        if (!this._initialized)
            this.initialize(val);
        else {
            this._update(val);
            this._dirty = true;
        }
        diagnostics.report(this);
    }
    // abstract _intrinsic_default(): T
    _default_override() {
        return unset;
    }
    get dirty() {
        return this._dirty;
    }
    //protected abstract _update(attr_value: T): void
    _update(attr_value) {
        this.validate(attr_value);
        if (this.convert != null) {
            const converted = this.convert(attr_value);
            if (converted !== undefined)
                attr_value = converted;
        }
        this._value = attr_value;
        this.on_update?.(attr_value, this.obj);
    }
    toString() {
        /*${this.name}*/
        return `Prop(${this.obj}.${this.attr}, value: ${valueToString(this._value)})`;
    }
    // ----- customizable policies
    normalize(values) {
        return values;
    }
    validate(value) {
        if (!this.valid(value))
            throw new Error(`${this.obj}.${this.attr} given invalid value: ${valueToString(value)}`);
    }
    valid(value) {
        return this.kind.valid(value);
    }
}
Property.__name__ = "Property";
export class PropertyAlias {
    constructor(attr) {
        this.attr = attr;
    }
}
PropertyAlias.__name__ = "PropertyAlias";
export function Alias(attr) {
    return new PropertyAlias(attr);
}
//
// Primitive Properties
//
export class PrimitiveProperty extends Property {
}
PrimitiveProperty.__name__ = "PrimitiveProperty";
export class Font extends PrimitiveProperty {
    _default_override() {
        return settings.dev ? "Bokeh" : unset;
    }
}
Font.__name__ = "Font";
//
// DataSpec properties
//
export class ScalarSpec extends Property {
    constructor() {
        super(...arguments);
        this._value = unset;
    }
    get_value() {
        if (this._value !== unset)
            return this._value;
        else
            throw new Error(`${this.obj}.${this.attr} is unset`);
    }
    _update(attr_value) {
        if (isSpec(attr_value))
            this._value = attr_value;
        else {
            this._value = { value: attr_value }; // Value<T>
        }
        if (isPlainObject(this._value)) {
            const { _value } = this;
            this._value[serialize] = (serializer) => {
                const { value, field, expr, transform, units } = _value;
                return serializer.encode_struct((() => {
                    if (value !== undefined)
                        return { type: "value", value, transform, units };
                    else if (field !== undefined)
                        return { type: "field", field, transform, units };
                    else
                        return { type: "expr", expr, transform, units };
                })());
            };
        }
        if (isValue(this._value))
            this.validate(this._value.value);
    }
    materialize(value) {
        return value;
    }
    scalar(value, n) {
        return new UniformScalar(value, n);
    }
    uniform(source) {
        const obj = this.get_value();
        const n = source.get_length() ?? 1;
        if (isExpr(obj)) {
            const { expr, transform } = obj;
            let result = expr.compute(source);
            if (transform != null)
                result = transform.compute(result);
            result = this.materialize(result);
            return this.scalar(result, n);
        }
        else {
            const { value, transform } = obj;
            let result = value;
            if (transform != null)
                result = transform.compute(result);
            result = this.materialize(result);
            return this.scalar(result, n);
        }
    }
}
ScalarSpec.__name__ = "ScalarSpec";
export class AnyScalar extends ScalarSpec {
}
AnyScalar.__name__ = "AnyScalar";
export class ColorScalar extends ScalarSpec {
}
ColorScalar.__name__ = "ColorScalar";
export class NumberScalar extends ScalarSpec {
}
NumberScalar.__name__ = "NumberScalar";
export class StringScalar extends ScalarSpec {
}
StringScalar.__name__ = "StringScalar";
export class NullStringScalar extends ScalarSpec {
}
NullStringScalar.__name__ = "NullStringScalar";
export class ArrayScalar extends ScalarSpec {
}
ArrayScalar.__name__ = "ArrayScalar";
export class LineJoinScalar extends ScalarSpec {
}
LineJoinScalar.__name__ = "LineJoinScalar";
export class LineCapScalar extends ScalarSpec {
}
LineCapScalar.__name__ = "LineCapScalar";
export class LineDashScalar extends ScalarSpec {
}
LineDashScalar.__name__ = "LineDashScalar";
export class FontScalar extends ScalarSpec {
    _default_override() {
        return settings.dev ? "Bokeh" : unset;
    }
}
FontScalar.__name__ = "FontScalar";
export class FontSizeScalar extends ScalarSpec {
}
FontSizeScalar.__name__ = "FontSizeScalar";
export class FontStyleScalar extends ScalarSpec {
}
FontStyleScalar.__name__ = "FontStyleScalar";
export class TextAlignScalar extends ScalarSpec {
}
TextAlignScalar.__name__ = "TextAlignScalar";
export class TextBaselineScalar extends ScalarSpec {
}
TextBaselineScalar.__name__ = "TextBaselineScalar";
export class VectorSpec extends Property {
    constructor() {
        super(...arguments);
        this._value = unset;
    }
    get_value() {
        if (this._value !== unset)
            return this._value;
        else
            throw new Error(`${this.obj}.${this.attr} is unset`);
    }
    _update(attr_value) {
        if (isSpec(attr_value))
            this._value = attr_value;
        else
            this._value = { value: attr_value }; // Value<T>
        if (isPlainObject(this._value)) {
            const { _value } = this;
            this._value[serialize] = (serializer) => {
                const { value, field, expr, transform, units } = _value;
                return serializer.encode_struct((() => {
                    if (value !== undefined)
                        return { type: "value", value, transform, units };
                    else if (field !== undefined)
                        return { type: "field", field, transform, units };
                    else
                        return { type: "expr", expr, transform, units };
                })());
            };
        }
        if (isValue(this._value))
            this.validate(this._value.value);
    }
    materialize(value) {
        return value;
    }
    v_materialize(values) {
        return values;
    }
    scalar(value, n) {
        return new UniformScalar(value, n);
    }
    vector(values) {
        return new UniformVector(values);
    }
    uniform(source) {
        const obj = this.get_value();
        const n = source.get_length() ?? 1;
        if (isField(obj)) {
            const { field, transform } = obj;
            let array = source.get_column(field);
            if (array != null) {
                if (transform != null)
                    array = transform.v_compute(array);
                array = this.v_materialize(array);
                return this.vector(array);
            }
            else {
                logger.warn(`attempted to retrieve property array for nonexistent field '${field}'`);
                return this.scalar(null, n);
            }
        }
        else if (isExpr(obj)) {
            const { expr, transform } = obj;
            let array = expr.v_compute(source);
            if (transform != null)
                array = transform.v_compute(array);
            array = this.v_materialize(array);
            return this.vector(array);
        }
        else if (isValue(obj)) {
            const { value, transform } = obj;
            let result = value;
            if (transform != null)
                result = transform.compute(result);
            result = this.materialize(result);
            return this.scalar(result, n);
        }
        else
            unreachable();
    }
    array(source) {
        let array;
        const length = source.get_length() ?? 1;
        const obj = this.get_value();
        if (isField(obj)) {
            const { field } = obj;
            const column = source.get_column(field);
            if (column != null)
                array = this.normalize(column);
            else {
                logger.warn(`attempted to retrieve property array for nonexistent field '${field}'`);
                const missing = new Float64Array(length);
                missing.fill(NaN);
                array = missing;
            }
        }
        else if (isExpr(obj)) {
            const { expr } = obj;
            array = this.normalize(expr.v_compute(source));
        }
        else {
            const value = this.normalize([obj.value])[0];
            if (isNumber(value)) {
                const values = new Float64Array(length);
                values.fill(value);
                array = values;
            }
            else
                array = repeat(value, length);
        }
        const { transform } = obj;
        if (transform != null)
            array = transform.v_compute(array);
        return array;
    }
}
VectorSpec.__name__ = "VectorSpec";
export class DataSpec extends VectorSpec {
}
DataSpec.__name__ = "DataSpec";
export class UnitsSpec extends VectorSpec {
    constructor() {
        super(...arguments);
        this._value = unset;
    }
    _update(attr_value) {
        super._update(attr_value);
        if (this._value !== unset) {
            const { units } = this._value;
            if (units != null && !includes(this.valid_units, units)) {
                throw new Error(`units must be one of ${this.valid_units.join(", ")}; got: ${units}`);
            }
        }
    }
    get units() {
        return this._value !== unset ? this._value.units ?? this.default_units : this.default_units;
    }
    set units(units) {
        if (this._value !== unset) {
            if (units != this.default_units)
                this._value.units = units;
            else
                delete this._value.units;
        }
        else
            throw new Error(`${this.obj}.${this.attr} is unset`);
    }
}
UnitsSpec.__name__ = "UnitsSpec";
export class NumberUnitsSpec extends UnitsSpec {
    array(source) {
        return new Float64Array(super.array(source));
    }
}
NumberUnitsSpec.__name__ = "NumberUnitsSpec";
export class BaseCoordinateSpec extends DataSpec {
}
BaseCoordinateSpec.__name__ = "BaseCoordinateSpec";
export class CoordinateSpec extends BaseCoordinateSpec {
}
CoordinateSpec.__name__ = "CoordinateSpec";
export class CoordinateSeqSpec extends BaseCoordinateSpec {
}
CoordinateSeqSpec.__name__ = "CoordinateSeqSpec";
export class CoordinateSeqSeqSeqSpec extends BaseCoordinateSpec {
}
CoordinateSeqSeqSeqSpec.__name__ = "CoordinateSeqSeqSeqSpec";
export class XCoordinateSpec extends CoordinateSpec {
    constructor() {
        super(...arguments);
        this.dimension = "x";
    }
}
XCoordinateSpec.__name__ = "XCoordinateSpec";
export class YCoordinateSpec extends CoordinateSpec {
    constructor() {
        super(...arguments);
        this.dimension = "y";
    }
}
YCoordinateSpec.__name__ = "YCoordinateSpec";
export class XCoordinateSeqSpec extends CoordinateSeqSpec {
    constructor() {
        super(...arguments);
        this.dimension = "x";
    }
}
XCoordinateSeqSpec.__name__ = "XCoordinateSeqSpec";
export class YCoordinateSeqSpec extends CoordinateSeqSpec {
    constructor() {
        super(...arguments);
        this.dimension = "y";
    }
}
YCoordinateSeqSpec.__name__ = "YCoordinateSeqSpec";
export class XCoordinateSeqSeqSeqSpec extends CoordinateSeqSeqSeqSpec {
    constructor() {
        super(...arguments);
        this.dimension = "x";
    }
}
XCoordinateSeqSeqSeqSpec.__name__ = "XCoordinateSeqSeqSeqSpec";
export class YCoordinateSeqSeqSeqSpec extends CoordinateSeqSeqSeqSpec {
    constructor() {
        super(...arguments);
        this.dimension = "y";
    }
}
YCoordinateSeqSeqSeqSpec.__name__ = "YCoordinateSeqSeqSeqSpec";
export class AngleSpec extends NumberUnitsSpec {
    get default_units() { return "rad"; }
    get valid_units() { return [...enums.AngleUnits]; }
    materialize(value) {
        const coeff = -to_radians_coeff(this.units);
        return value * coeff;
    }
    v_materialize(values) {
        const coeff = -to_radians_coeff(this.units);
        const result = new Float32Array(values.length);
        mul(values, coeff, result); // TODO: in-place?
        return result;
    }
    array(_source) {
        throw new Error("not supported");
    }
}
AngleSpec.__name__ = "AngleSpec";
export class DistanceSpec extends NumberUnitsSpec {
    get default_units() { return "data"; }
    get valid_units() { return [...enums.SpatialUnits]; }
}
DistanceSpec.__name__ = "DistanceSpec";
export class NullDistanceSpec extends DistanceSpec {
    materialize(value) {
        return value ?? NaN;
    }
}
NullDistanceSpec.__name__ = "NullDistanceSpec";
export class BooleanSpec extends DataSpec {
    v_materialize(values) {
        return new Uint8Array(values);
    }
    array(source) {
        return new Uint8Array(super.array(source));
    }
}
BooleanSpec.__name__ = "BooleanSpec";
export class IntSpec extends DataSpec {
    v_materialize(values) {
        return isTypedArray(values) ? values : new Int32Array(values);
    }
    array(source) {
        return new Int32Array(super.array(source));
    }
}
IntSpec.__name__ = "IntSpec";
export class NumberSpec extends DataSpec {
    v_materialize(values) {
        return isTypedArray(values) ? values : new Float64Array(values);
    }
    array(source) {
        return new Float64Array(super.array(source));
    }
}
NumberSpec.__name__ = "NumberSpec";
export class ScreenSizeSpec extends NumberSpec {
    valid(value) {
        return isNumber(value) && value >= 0;
    }
}
ScreenSizeSpec.__name__ = "ScreenSizeSpec";
export class ColorSpec extends DataSpec {
    materialize(color) {
        return encode_rgba(color2rgba(color));
    }
    v_materialize(colors) {
        if (is_NDArray(colors)) {
            if (colors.dtype == "uint32" && colors.dimension == 1) {
                return to_big_endian(colors);
            }
            else if (colors.dtype == "uint8" && colors.dimension == 1) {
                const [n] = colors.shape;
                const array = new RGBAArray(4 * n);
                let j = 0;
                for (const gray of colors) {
                    array[j++] = gray;
                    array[j++] = gray;
                    array[j++] = gray;
                    array[j++] = 255;
                }
                return new ColorArray(array.buffer);
            }
            else if (colors.dtype == "uint8" && colors.dimension == 2) {
                const [n, d] = colors.shape;
                if (d == 4) {
                    return new ColorArray(colors.buffer);
                }
                else if (d == 3) {
                    const array = new RGBAArray(4 * n);
                    for (let i = 0, j = 0; i < d * n;) {
                        array[j++] = colors[i++];
                        array[j++] = colors[i++];
                        array[j++] = colors[i++];
                        array[j++] = 255;
                    }
                    return new ColorArray(array.buffer);
                }
            }
            else if ((colors.dtype == "float32" || colors.dtype == "float64") && colors.dimension == 2) {
                const [n, d] = colors.shape;
                if (d == 3 || d == 4) {
                    const array = new RGBAArray(4 * n);
                    for (let i = 0, j = 0; i < d * n;) {
                        array[j++] = colors[i++] * 255;
                        array[j++] = colors[i++] * 255;
                        array[j++] = colors[i++] * 255;
                        array[j++] = (d == 3 ? 1 : colors[i++]) * 255;
                    }
                    return new ColorArray(array.buffer);
                }
            }
            else if (colors.dtype == "object" && colors.dimension == 1) {
                return this._from_css_array(colors);
            }
        }
        else {
            return this._from_css_array(colors);
        }
        throw new Error("invalid color array");
    }
    _from_css_array(colors) {
        const n = colors.length;
        const array = new RGBAArray(4 * n);
        let j = 0;
        for (const color of colors) {
            const [r, g, b, a] = color2rgba(color);
            array[j++] = r;
            array[j++] = g;
            array[j++] = b;
            array[j++] = a;
        }
        return new ColorArray(array.buffer);
    }
    vector(values) {
        return new ColorUniformVector(values);
    }
}
ColorSpec.__name__ = "ColorSpec";
export class NDArraySpec extends DataSpec {
}
NDArraySpec.__name__ = "NDArraySpec";
export class AnySpec extends DataSpec {
}
AnySpec.__name__ = "AnySpec";
export class StringSpec extends DataSpec {
}
StringSpec.__name__ = "StringSpec";
export class NullStringSpec extends DataSpec {
}
NullStringSpec.__name__ = "NullStringSpec";
export class ArraySpec extends DataSpec {
}
ArraySpec.__name__ = "ArraySpec";
export class MarkerSpec extends DataSpec {
}
MarkerSpec.__name__ = "MarkerSpec";
export class LineJoinSpec extends DataSpec {
}
LineJoinSpec.__name__ = "LineJoinSpec";
export class LineCapSpec extends DataSpec {
}
LineCapSpec.__name__ = "LineCapSpec";
export class LineDashSpec extends DataSpec {
}
LineDashSpec.__name__ = "LineDashSpec";
export class FontSpec extends DataSpec {
    _default_override() {
        return settings.dev ? "Bokeh" : unset;
    }
}
FontSpec.__name__ = "FontSpec";
export class FontSizeSpec extends DataSpec {
}
FontSizeSpec.__name__ = "FontSizeSpec";
export class FontStyleSpec extends DataSpec {
}
FontStyleSpec.__name__ = "FontStyleSpec";
export class TextAlignSpec extends DataSpec {
}
TextAlignSpec.__name__ = "TextAlignSpec";
export class TextBaselineSpec extends DataSpec {
}
TextBaselineSpec.__name__ = "TextBaselineSpec";
//# sourceMappingURL=properties.js.map