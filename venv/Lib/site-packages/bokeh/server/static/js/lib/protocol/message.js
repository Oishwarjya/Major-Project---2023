import { Buffer } from "../core/serialization";
import { unique_id } from "../core/util/string";
import { assert } from "../core/util/assert";
export class Message {
    constructor(header, metadata, content) {
        this.header = header;
        this.metadata = metadata;
        this.content = content;
        this._buffers = new Map();
    }
    get buffers() {
        return this._buffers;
    }
    static assemble(header_json, metadata_json, content_json) {
        const header = JSON.parse(header_json);
        const metadata = JSON.parse(metadata_json);
        const content = JSON.parse(content_json);
        return new Message(header, metadata, content);
    }
    assemble_buffer(buf_header, buf_payload) {
        const nb = this.header.num_buffers ?? 0;
        if (nb <= this._buffers.size)
            throw new Error(`too many buffers received, expecting ${nb}`);
        const { id } = JSON.parse(buf_header);
        this._buffers.set(id, buf_payload);
    }
    static create(msgtype, metadata, content) {
        const header = Message.create_header(msgtype);
        return new Message(header, metadata, content);
    }
    static create_header(msgtype) {
        return {
            msgid: unique_id(),
            msgtype,
        };
    }
    complete() {
        const { num_buffers } = this.header;
        return num_buffers == null || this._buffers.size == num_buffers;
    }
    send(socket) {
        assert(this.header.num_buffers == null);
        const buffers = [];
        const content_json = JSON.stringify(this.content, (_, val) => {
            if (val instanceof Buffer) {
                const ref = { id: `${buffers.length}` };
                buffers.push([ref, val.buffer]);
                return ref;
            }
            else
                return val;
        });
        const num_buffers = buffers.length;
        if (num_buffers > 0) {
            this.header.num_buffers = num_buffers;
        }
        const header_json = JSON.stringify(this.header);
        const metadata_json = JSON.stringify(this.metadata);
        socket.send(header_json);
        socket.send(metadata_json);
        socket.send(content_json);
        for (const [ref, buffer] of buffers) {
            socket.send(JSON.stringify(ref));
            socket.send(buffer);
        }
    }
    msgid() {
        return this.header.msgid;
    }
    msgtype() {
        return this.header.msgtype;
    }
    reqid() {
        return this.header.reqid;
    }
    // return the reason we should close on bad protocol, if there is one
    problem() {
        if (!("msgid" in this.header))
            return "No msgid in header";
        else if (!("msgtype" in this.header))
            return "No msgtype in header";
        else
            return null;
    }
}
Message.__name__ = "Message";
//# sourceMappingURL=message.js.map