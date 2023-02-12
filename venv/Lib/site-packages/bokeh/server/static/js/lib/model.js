var _a;
import { HasProps } from "./core/has_props";
import { isString, isPlainObject, isFunction } from "./core/util/types";
import { dict } from "./core/util/object";
import { equals } from "./core/util/eq";
import { logger } from "./core/logging";
export class Model extends HasProps {
    constructor(attrs) {
        super(attrs);
    }
    get is_syncable() {
        return this.syncable;
    }
    [equals](that, cmp) {
        return (cmp.structural ? true : cmp.eq(this.id, that.id)) && super[equals](that, cmp);
    }
    initialize() {
        super.initialize();
        this._js_callbacks = new Map();
    }
    connect_signals() {
        super.connect_signals();
        this._update_property_callbacks();
        this.connect(this.properties.js_property_callbacks.change, () => this._update_property_callbacks());
        this.connect(this.properties.js_event_callbacks.change, () => this._update_event_callbacks());
        this.connect(this.properties.subscribed_events.change, () => this._update_event_callbacks());
    }
    /*protected*/ _process_event(event) {
        for (const callback of dict(this.js_event_callbacks).get(event.event_name) ?? [])
            callback.execute(event);
        if (this.document != null && this.subscribed_events.has(event.event_name))
            this.document.event_manager.send_event(event);
    }
    trigger_event(event) {
        if (this.document != null) {
            event.origin = this;
            this.document.event_manager.trigger(event);
        }
    }
    _update_event_callbacks() {
        if (this.document == null) {
            logger.warn("WARNING: Document not defined for updating event callbacks");
            return;
        }
        this.document.event_manager.subscribed_models.add(this);
    }
    _update_property_callbacks() {
        const signal_for = (event) => {
            const [evt, attr = null] = event.split(":");
            return attr != null ? this.properties[attr][evt] : this[evt];
        };
        for (const [event, callbacks] of this._js_callbacks) {
            const signal = signal_for(event);
            for (const cb of callbacks)
                this.disconnect(signal, cb);
        }
        this._js_callbacks.clear();
        for (const [event, callbacks] of dict(this.js_property_callbacks)) {
            const wrappers = callbacks.map((cb) => () => cb.execute(this));
            this._js_callbacks.set(event, wrappers);
            const signal = signal_for(event);
            for (const cb of wrappers)
                this.connect(signal, cb);
        }
    }
    _doc_attached() {
        if (!dict(this.js_event_callbacks).is_empty || this.subscribed_events.size != 0)
            this._update_event_callbacks();
    }
    _doc_detached() {
        this.document.event_manager.subscribed_models.delete(this);
    }
    select(selector) {
        if (isString(selector))
            return [...this.references()].filter((ref) => ref instanceof Model && ref.name === selector);
        else if (isPlainObject(selector) && "type" in selector)
            return [...this.references()].filter((ref) => ref.type == selector.type);
        else if (selector.prototype instanceof HasProps)
            return [...this.references()].filter((ref) => ref instanceof selector);
        else
            throw new Error(`invalid selector ${selector}`);
    }
    select_one(selector) {
        const result = this.select(selector);
        switch (result.length) {
            case 0:
                return null;
            case 1:
                return result[0];
            default:
                throw new Error(`found more than one object matching given selector ${selector}`);
        }
    }
    on_event(event, callback) {
        const name = isString(event) ? event : event.prototype.event_name;
        this.js_event_callbacks[name] = [
            ...dict(this.js_event_callbacks).get(name) ?? [],
            isFunction(callback) ? { execute: callback } : callback,
        ];
    }
}
_a = Model;
Model.__name__ = "Model";
(() => {
    _a.define(({ Any, Unknown, Boolean, String, Array, Set, Dict, Nullable }) => ({
        tags: [Array(Unknown), []],
        name: [Nullable(String), null],
        js_property_callbacks: [Dict(Array(Any /*TODO*/)), {}],
        js_event_callbacks: [Dict(Array(Any /*TODO*/)), {}],
        subscribed_events: [Set(String), new globalThis.Set()],
        syncable: [Boolean, true],
    }));
})();
//# sourceMappingURL=model.js.map