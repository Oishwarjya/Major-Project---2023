import { Signal0, Signal } from "./signaling";
import { isArray } from "./util/types";
export class View {
    constructor(options) {
        this.removed = new Signal0(this, "removed");
        this._ready = Promise.resolve(undefined);
        /** @internal */
        this._slots = new WeakMap();
        this._removed = false;
        this._idle_notified = false;
        const { model, parent, owner } = options;
        this.model = model;
        this.parent = parent;
        if (parent == null) {
            this.root = this;
            this.owner = owner ?? new ViewManager([this]);
        }
        else {
            this.root = parent.root;
            this.owner = this.root.owner;
        }
    }
    get ready() {
        return this._ready;
    }
    *children() { }
    connect(signal, slot) {
        let new_slot = this._slots.get(slot);
        if (new_slot == null) {
            new_slot = (args, sender) => {
                const promise = Promise.resolve(slot.call(this, args, sender));
                this._ready = this._ready.then(() => promise);
                if (this.root != this) {
                    this.root._ready = this.root._ready.then(() => this._ready);
                }
            };
            this._slots.set(slot, new_slot);
        }
        return signal.connect(new_slot, this);
    }
    disconnect(signal, slot) {
        return signal.disconnect(slot, this);
    }
    initialize() {
        this._has_finished = false;
    }
    async lazy_initialize() { }
    remove() {
        this.disconnect_signals();
        this.removed.emit();
        this._removed = true;
    }
    toString() {
        return `${this.model.type}View(${this.model.id})`;
    }
    serializable_state() {
        return { type: this.model.type };
    }
    get is_root() {
        return this.parent == null;
    }
    has_finished() {
        return this._has_finished;
    }
    get is_idle() {
        return this.has_finished();
    }
    connect_signals() { }
    disconnect_signals() {
        Signal.disconnect_receiver(this);
    }
    on_change(properties, fn) {
        for (const property of isArray(properties) ? properties : [properties]) {
            this.connect(property.change, fn);
        }
    }
    cursor(_sx, _sy) {
        return null;
    }
    notify_finished() {
        if (!this.is_root)
            this.root.notify_finished();
        else {
            if (!this._idle_notified && this.has_finished()) {
                if (this.model.document != null) {
                    this._idle_notified = true;
                    this.model.document.notify_idle(this.model);
                }
            }
        }
    }
}
View.__name__ = "View";
export class ViewManager {
    constructor(roots = []) {
        this.roots = new Set(roots);
    }
    get(model) {
        for (const view of this.roots) {
            if (view.model == model)
                return view;
        }
        return null;
    }
    add(view) {
        this.roots.add(view);
    }
    delete(view) {
        this.roots.delete(view);
    }
    *[Symbol.iterator]() {
        yield* this.roots;
    }
    *query(fn) {
        function* descend(view) {
            if (fn(view)) {
                yield view;
            }
            else {
                for (const child of view.children()) {
                    yield* descend(child);
                }
            }
        }
        for (const root of this.roots) {
            yield* descend(root);
        }
    }
    *find(model) {
        yield* this.query((view) => view.model == model);
    }
    get_one(model) {
        const view = this.find_one(model);
        if (view != null)
            return view;
        else
            throw new Error(`cannot find a view for ${model}`);
    }
    find_one(model) {
        for (const view of this.find(model)) {
            return view;
        }
        return null;
    }
    find_all(model) {
        return [...this.find(model)];
    }
}
ViewManager.__name__ = "ViewManager";
//# sourceMappingURL=view.js.map