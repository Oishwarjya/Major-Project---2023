import { DocumentEventBatch } from "../document";
import { Message } from "../protocol/message";
import { logger } from "../core/logging";
export class ClientSession {
    constructor(_connection, document) {
        this._connection = _connection;
        this.document = document;
        this._document_listener = (event) => {
            this._document_changed(event);
        };
        this.document.on_change(this._document_listener, true);
    }
    // XXX: this is only needed in tests
    get id() {
        return this._connection.id;
    }
    handle(message) {
        const msgtype = message.msgtype();
        switch (msgtype) {
            case "PATCH-DOC": {
                this._handle_patch(message);
                break;
            }
            case "OK": {
                this._handle_ok(message);
                break;
            }
            case "ERROR": {
                this._handle_error(message);
                break;
            }
            default:
                logger.debug(`Doing nothing with message '${msgtype}'`);
        }
    }
    close() {
        this._connection.close();
    }
    /*protected*/ _connection_closed() {
        this.document.remove_on_change(this._document_listener);
    }
    // Sends a request to the server for info about the server, such as its Bokeh
    // version. Returns a promise, the value of the promise is a free-form dictionary
    // of server details.
    async request_server_info() {
        const message = Message.create("SERVER-INFO-REQ", {}, {});
        const reply = await this._connection.send_with_reply(message);
        return reply.content;
    }
    // Sends some request to the server (no guarantee about which one) and returns
    // a promise which is completed when the server replies. The purpose of this
    // is that if you wait for the promise to be completed, you know the server
    // has processed the request. This is useful when writing tests because once
    // the server has processed this request it should also have processed any
    // events or requests you sent previously, which means you can check for the
    // results of that processing without a race condition. (This assumes the
    // server processes events in sequence, which it mostly has to semantically,
    // since reordering events might change the final state.)
    async force_roundtrip() {
        await this.request_server_info();
    }
    _document_changed(event) {
        const events = event instanceof DocumentEventBatch ? event.events : [event];
        const patch = this.document.create_json_patch(events);
        // TODO (havocp) the connection may be closed here, which will
        // cause this send to throw an error - need to deal with it more cleanly.
        const message = Message.create("PATCH-DOC", {}, patch);
        this._connection.send(message);
    }
    _handle_patch(message) {
        this.document.apply_json_patch(message.content, message.buffers);
    }
    _handle_ok(message) {
        logger.trace(`Unhandled OK reply to ${message.reqid()}`);
    }
    _handle_error(message) {
        logger.error(`Unhandled ERROR reply to ${message.reqid()}: ${message.content.text}`);
    }
}
ClientSession.__name__ = "ClientSession";
//# sourceMappingURL=session.js.map