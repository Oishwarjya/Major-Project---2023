import { default_resolver } from "../base";
import { version as js_version } from "../version";
import { logger } from "../core/logging";
import { DocumentReady, LODStart, LODEnd } from "../core/bokeh_events";
import { ModelResolver } from "../core/resolvers";
import { Serializer } from "../core/serialization";
import { Deserializer } from "../core/serialization/deserializer";
import { pyify_version } from "../core/util/version";
import { Signal0 } from "../core/signaling";
import { equals } from "../core/util/eq";
import { copy, includes } from "../core/util/array";
import * as sets from "../core/util/set";
import { Model } from "../model";
import { decode_def } from "./defs";
import { DocumentEventBatch, RootRemovedEvent, TitleChangedEvent, MessageSentEvent, RootAddedEvent, } from "./events";
Deserializer.register("model", decode_def);
// Dispatches events to the subscribed models
export class EventManager {
    constructor(document) {
        this.document = document;
        this.subscribed_models = new Set();
    }
    send_event(bokeh_event) {
        const event = new MessageSentEvent(this.document, "bokeh_event", bokeh_event);
        this.document._trigger_on_change(event);
    }
    trigger(event) {
        for (const model of this.subscribed_models) {
            if (event.origin != null && event.origin != model)
                continue;
            model._process_event(event);
        }
    }
}
EventManager.__name__ = "EventManager";
export const documents = [];
export const DEFAULT_TITLE = "Bokeh Application";
// This class should match the API of the Python Document class
// as much as possible.
export class Document {
    constructor(options) {
        documents.push(this);
        this._init_timestamp = Date.now();
        this._resolver = options?.resolver ?? new ModelResolver(default_resolver);
        this._title = DEFAULT_TITLE;
        this._roots = [];
        this._all_models = new Map();
        this._new_models = new Set();
        this._all_models_freeze_count = 0;
        this._callbacks = new Map();
        this._message_callbacks = new Map();
        this.event_manager = new EventManager(this);
        this.idle = new Signal0(this, "idle");
        this._idle_roots = new WeakSet();
        this._interactive_timestamp = null;
        this._interactive_plot = null;
    }
    [equals](that, _cmp) {
        return this == that;
    }
    get is_idle() {
        // TODO: models without views, e.g. data models
        for (const root of this._roots) {
            if (!this._idle_roots.has(root))
                return false;
        }
        return true;
    }
    notify_idle(model) {
        this._idle_roots.add(model);
        if (this.is_idle) {
            logger.info(`document idle at ${Date.now() - this._init_timestamp} ms`);
            this.event_manager.send_event(new DocumentReady());
            this.idle.emit();
        }
    }
    clear() {
        this._push_all_models_freeze();
        try {
            while (this._roots.length > 0) {
                this.remove_root(this._roots[0]);
            }
        }
        finally {
            this._pop_all_models_freeze();
        }
    }
    interactive_start(plot, finalize = null) {
        if (this._interactive_plot == null) {
            this._interactive_plot = plot;
            this._interactive_plot.trigger_event(new LODStart());
        }
        this._interactive_finalize = finalize;
        this._interactive_timestamp = Date.now();
    }
    interactive_stop() {
        if (this._interactive_plot != null) {
            this._interactive_plot.trigger_event(new LODEnd());
            if (this._interactive_finalize != null) {
                this._interactive_finalize();
            }
        }
        this._interactive_plot = null;
        this._interactive_timestamp = null;
        this._interactive_finalize = null;
    }
    interactive_duration() {
        if (this._interactive_timestamp == null)
            return -1;
        else
            return Date.now() - this._interactive_timestamp;
    }
    destructively_move(dest_doc) {
        if (dest_doc === this) {
            throw new Error("Attempted to overwrite a document with itself");
        }
        dest_doc.clear();
        // we have to remove ALL roots before adding any
        // to the new doc or else models referenced from multiple
        // roots could be in both docs at once, which isn't allowed.
        const roots = copy(this._roots);
        this.clear();
        for (const root of roots) {
            if (root.document != null)
                throw new Error(`Somehow we didn't detach ${root}`);
        }
        if (this._all_models.size != 0) {
            throw new Error(`this._all_models still had stuff in it: ${this._all_models}`);
        }
        for (const root of roots) {
            dest_doc.add_root(root);
        }
        dest_doc.set_title(this._title);
    }
    // TODO other fields of doc
    _push_all_models_freeze() {
        this._all_models_freeze_count += 1;
    }
    _pop_all_models_freeze() {
        this._all_models_freeze_count -= 1;
        if (this._all_models_freeze_count === 0) {
            this._recompute_all_models();
        }
    }
    /*protected*/ _invalidate_all_models() {
        logger.debug("invalidating document models");
        // if freeze count is > 0, we'll recompute on unfreeze
        if (this._all_models_freeze_count === 0) {
            this._recompute_all_models();
        }
    }
    _recompute_all_models() {
        let new_all_models_set = new Set();
        for (const r of this._roots) {
            new_all_models_set = sets.union(new_all_models_set, r.references());
        }
        const old_all_models_set = new Set(this._all_models.values());
        const to_detach = sets.difference(old_all_models_set, new_all_models_set);
        const to_attach = sets.difference(new_all_models_set, old_all_models_set);
        const recomputed = new Map();
        for (const model of new_all_models_set) {
            recomputed.set(model.id, model);
        }
        for (const d of to_detach) {
            d.detach_document();
        }
        for (const model of to_attach) {
            model.attach_document(this);
            this._new_models.add(model);
        }
        this._all_models = recomputed; // XXX
    }
    roots() {
        return this._roots;
    }
    _add_root(model) {
        if (includes(this._roots, model))
            return false;
        this._push_all_models_freeze();
        try {
            this._roots.push(model);
        }
        finally {
            this._pop_all_models_freeze();
        }
        return true;
    }
    _remove_root(model) {
        const i = this._roots.indexOf(model);
        if (i < 0)
            return false;
        this._push_all_models_freeze();
        try {
            this._roots.splice(i, 1);
        }
        finally {
            this._pop_all_models_freeze();
        }
        return true;
    }
    _set_title(title) {
        const new_title = title != this._title;
        if (new_title)
            this._title = title;
        return new_title;
    }
    add_root(model) {
        if (this._add_root(model))
            this._trigger_on_change(new RootAddedEvent(this, model));
    }
    remove_root(model) {
        if (this._remove_root(model))
            this._trigger_on_change(new RootRemovedEvent(this, model));
    }
    set_title(title) {
        if (this._set_title(title))
            this._trigger_on_change(new TitleChangedEvent(this, title));
    }
    title() {
        return this._title;
    }
    get_model_by_id(model_id) {
        return this._all_models.get(model_id) ?? null;
    }
    get_model_by_name(name) {
        const found = [];
        for (const model of this._all_models.values()) {
            if (model instanceof Model && model.name == name)
                found.push(model);
        }
        switch (found.length) {
            case 0:
                return null;
            case 1:
                return found[0];
            default:
                throw new Error(`Multiple models are named '${name}'`);
        }
    }
    on_message(msg_type, callback) {
        const message_callbacks = this._message_callbacks.get(msg_type);
        if (message_callbacks == null)
            this._message_callbacks.set(msg_type, new Set([callback]));
        else
            message_callbacks.add(callback);
    }
    remove_on_message(msg_type, callback) {
        this._message_callbacks.get(msg_type)?.delete(callback);
    }
    _trigger_on_message(msg_type, msg_data) {
        const message_callbacks = this._message_callbacks.get(msg_type);
        if (message_callbacks != null) {
            for (const cb of message_callbacks) {
                cb(msg_data);
            }
        }
    }
    on_change(callback, allow_batches = false) {
        if (!this._callbacks.has(callback)) {
            this._callbacks.set(callback, allow_batches);
        }
    }
    remove_on_change(callback) {
        this._callbacks.delete(callback);
    }
    _trigger_on_change(event) {
        for (const [callback, allow_batches] of this._callbacks) {
            if (!allow_batches && event instanceof DocumentEventBatch) {
                for (const ev of event.events) {
                    callback(ev);
                }
            }
            else {
                callback(event); // TODO
            }
        }
    }
    to_json_string(include_defaults = true) {
        return JSON.stringify(this.to_json(include_defaults));
    }
    to_json(include_defaults = true) {
        const serializer = new Serializer({ include_defaults });
        const roots = serializer.encode(this._roots);
        return {
            version: js_version,
            title: this._title,
            roots,
        };
    }
    static from_json_string(s, events) {
        const json = JSON.parse(s);
        return Document.from_json(json, events);
    }
    static _handle_version(json) {
        if (json.version != null) {
            const py_version = json.version;
            const is_dev = py_version.indexOf("+") !== -1 || py_version.indexOf("-") !== -1;
            const versions_string = `Library versions: JS (${js_version}) / Python (${py_version})`;
            if (!is_dev && pyify_version(js_version) != py_version) {
                logger.warn("JS/Python version mismatch");
                logger.warn(versions_string);
            }
            else
                logger.debug(versions_string);
        }
        else
            logger.warn("'version' field is missing");
    }
    static from_json(doc_json, events) {
        logger.debug("Creating Document from JSON");
        Document._handle_version(doc_json);
        const resolver = new ModelResolver(default_resolver);
        if (doc_json.defs != null) {
            const deserializer = new Deserializer(resolver);
            deserializer.decode(doc_json.defs);
        }
        const doc = new Document({ resolver });
        doc._push_all_models_freeze();
        const listener = (event) => events?.push(event);
        doc.on_change(listener, true);
        const deserializer = new Deserializer(resolver, doc._all_models, (obj) => obj.attach_document(doc));
        const roots = deserializer.decode(doc_json.roots);
        doc.remove_on_change(listener);
        for (const root of roots) {
            doc.add_root(root);
        }
        if (doc_json.title != null)
            doc.set_title(doc_json.title);
        doc._pop_all_models_freeze();
        return doc;
    }
    replace_with_json(json) {
        const replacement = Document.from_json(json);
        replacement.destructively_move(this);
    }
    create_json_patch(events) {
        for (const event of events) {
            if (event.document != this)
                throw new Error("Cannot create a patch using events from a different document");
        }
        const references = new Map();
        for (const model of this._all_models.values()) {
            if (!this._new_models.has(model)) {
                references.set(model, model.ref());
            }
        }
        const serializer = new Serializer({ references, binary: true });
        const patch = { events: serializer.encode(events) };
        this._new_models.clear();
        return patch;
    }
    apply_json_patch(patch, buffers = new Map()) {
        this._push_all_models_freeze();
        const deserializer = new Deserializer(this._resolver, this._all_models, (obj) => obj.attach_document(this));
        const events = deserializer.decode(patch.events, buffers);
        for (const event of events) {
            switch (event.kind) {
                case "MessageSent": {
                    const { msg_type, msg_data } = event;
                    this._trigger_on_message(msg_type, msg_data);
                    break;
                }
                case "ModelChanged": {
                    const { model, attr, new: value } = event;
                    model.setv({ [attr]: value }, { sync: false });
                    break;
                }
                case "ColumnDataChanged": {
                    const { model, attr, cols, data } = event;
                    if (cols != null) {
                        const current_data = model.property(attr).get_value();
                        for (const k in current_data) {
                            if (!(k in data)) {
                                data[k] = current_data[k];
                            }
                        }
                    }
                    model.setv({ data }, { sync: false, check_eq: false });
                    break;
                }
                case "ColumnsStreamed": {
                    const { model, attr, data, rollover } = event;
                    const prop = model.property(attr);
                    model.stream_to(prop, data, rollover, { sync: false });
                    break;
                }
                case "ColumnsPatched": {
                    const { model, attr, patches } = event;
                    const prop = model.property(attr);
                    model.patch_to(prop, patches, { sync: false });
                    break;
                }
                case "RootAdded": {
                    this._add_root(event.model);
                    break;
                }
                case "RootRemoved": {
                    this._remove_root(event.model);
                    break;
                }
                case "TitleChanged": {
                    this._set_title(event.title);
                    break;
                }
                default:
                    throw new Error(`unknown patch event type '${event.kind}'`); // XXX
            }
        }
        this._pop_all_models_freeze();
    }
}
Document.__name__ = "Document";
//# sourceMappingURL=document.js.map