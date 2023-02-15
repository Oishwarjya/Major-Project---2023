import { isTypedArray, isArray, isNumber } from "./util/types";
import { entries } from "./util/object";
import { union } from "./util/set";
import * as typed_array from "./util/typed_array";
//exported for testing
export function stream_to_column(col, new_col, rollover) {
    if (isArray(col)) {
        const result = col.concat(new_col);
        if (rollover != null && result.length > rollover)
            return result.slice(-rollover);
        else
            return result;
    }
    else if (isTypedArray(col)) {
        const total_len = col.length + new_col.length;
        // handle rollover case for typed arrays
        if (rollover != null && total_len > rollover) {
            const start = total_len - rollover;
            const end = col.length;
            // resize col if it is shorter than the rollover length
            let result;
            if (col.length < rollover) {
                result = new col.constructor(rollover);
                result.set(col, 0);
            }
            else
                result = col;
            // shift values in original col to accommodate new_col
            for (let i = start, endi = end; i < endi; i++) {
                result[i - start] = result[i];
            }
            // update end values in col with new_col
            for (let i = 0, endi = new_col.length; i < endi; i++) {
                result[i + (end - start)] = new_col[i];
            }
            return result;
        }
        else {
            const tmp = new col.constructor(new_col);
            return typed_array.concat(col, tmp);
        }
    }
    else
        throw new Error("unsupported array types");
}
// exported for testing
export function slice(ind, length) {
    let start, step, stop;
    if (isNumber(ind)) {
        start = ind;
        stop = ind + 1;
        step = 1;
    }
    else {
        start = ind.start != null ? ind.start : 0;
        stop = ind.stop != null ? ind.stop : length;
        step = ind.step != null ? ind.step : 1;
    }
    return [start, stop, step];
}
// exported for testing
export function patch_to_column(col, patch) {
    const patched = new Set();
    let patched_range = false;
    for (const [ind, val] of patch) {
        // make the single index case look like the length-3 multi-index case
        let shape;
        let item;
        let index;
        let value;
        if (isArray(ind)) {
            const [i] = ind;
            patched.add(i);
            shape = col[i].shape;
            item = col[i];
            value = val;
            // this is basically like NumPy's "newaxis", inserting an empty dimension
            // makes length 2 and 3 multi-index cases uniform, so that the same code
            // can handle both
            if (ind.length === 2) {
                shape = [1, shape[0]];
                index = [ind[0], 0, ind[1]];
            }
            else
                index = ind;
        }
        else {
            if (isNumber(ind)) {
                value = [val];
                patched.add(ind);
            }
            else {
                value = val;
                patched_range = true;
            }
            index = [0, 0, ind];
            shape = [1, col.length];
            item = col;
        }
        // now this one nested loop handles all cases
        let flat_index = 0;
        const [istart, istop, istep] = slice(index[1], shape[0]);
        const [jstart, jstop, jstep] = slice(index[2], shape[1]);
        for (let i = istart; i < istop; i += istep) {
            for (let j = jstart; j < jstop; j += jstep) {
                if (patched_range) {
                    patched.add(j);
                }
                item[i * shape[1] + j] = value[flat_index];
                flat_index++;
            }
        }
    }
    return patched;
}
export function stream_to_columns(data, new_data, rollover) {
    for (const [name, new_column] of entries(new_data)) {
        data[name] = stream_to_column(data[name], new_column, rollover);
    }
}
export function patch_to_columns(data, patches) {
    let patched = new Set();
    for (const [column, patch] of entries(patches)) {
        patched = union(patched, patch_to_column(data[column], patch)); // XXX
    }
    return patched;
}
//# sourceMappingURL=patching.js.map