import { isBoolean, isNumber, isString, isSymbol, isArray, isIterable, isObject, isPlainObject } from "./types";
import { entries } from "./object";
export const pretty = Symbol("pretty");
function is_Printable(obj) {
    return isObject(obj) && pretty in obj;
}
export class Printer {
    constructor(options) {
        this.visited = new Set();
        this.precision = options?.precision;
    }
    to_string(obj) {
        if (isObject(obj)) {
            if (this.visited.has(obj))
                return "<circular>";
            else
                this.visited.add(obj);
        }
        if (is_Printable(obj))
            return obj[pretty](this);
        else if (isBoolean(obj))
            return this.boolean(obj);
        else if (isNumber(obj))
            return this.number(obj);
        else if (isString(obj))
            return this.string(obj);
        else if (isArray(obj))
            return this.array(obj);
        else if (isIterable(obj))
            return this.iterable(obj);
        else if (isPlainObject(obj))
            return this.object(obj);
        else if (isSymbol(obj))
            return this.symbol(obj);
        else if (obj instanceof ArrayBuffer)
            return this.array_buffer(obj);
        else
            return `${obj}`;
    }
    token(val) {
        return val;
    }
    boolean(val) {
        return `${val}`;
    }
    number(val) {
        if (this.precision != null)
            return val.toFixed(this.precision);
        else
            return `${val}`;
    }
    string(val) {
        const sq = val.includes("'");
        const dq = val.includes('"');
        if (sq && dq)
            return `\`${val.replace(/`/g, "\\`")}\``;
        else if (dq)
            return `'${val}'`;
        else
            return `"${val}"`;
    }
    symbol(val) {
        return val.toString();
    }
    array(obj) {
        const T = this.token;
        const items = [];
        for (const entry of obj) {
            items.push(this.to_string(entry));
        }
        return `${T("[")}${items.join(`${T(",")} `)}${T("]")}`;
    }
    iterable(obj) {
        const T = this.token;
        const tag = Object(obj)[Symbol.toStringTag] ?? "Object";
        const items = this.array(obj);
        return `${tag}${T("(")}${items}${T(")")}`;
    }
    object(obj) {
        const T = this.token;
        const items = [];
        for (const [key, val] of entries(obj)) {
            items.push(`${key}${T(":")} ${this.to_string(val)}`);
        }
        return `${T("{")}${items.join(`${T(",")} `)}${T("}")}`;
    }
    array_buffer(obj) {
        return `ArrayBuffer(#${obj.byteLength})`;
    }
}
Printer.__name__ = "Printer";
export function to_string(obj, options) {
    const printer = new Printer(options);
    return printer.to_string(obj);
}
//# sourceMappingURL=pretty.js.map