import { buffer_to_base64 } from "../util/buffer";
import { equals } from "../util/eq";
export class Buffer {
    constructor(buffer) {
        this.buffer = buffer;
    }
    to_base64() {
        return buffer_to_base64(this.buffer);
    }
    [equals](that, cmp) {
        return cmp.eq(this.buffer, that.buffer);
    }
}
Buffer.__name__ = "Buffer";
export class Base64Buffer extends Buffer {
    toJSON() {
        return this.to_base64();
    }
}
Base64Buffer.__name__ = "Base64Buffer";
//# sourceMappingURL=buffer.js.map