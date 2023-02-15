export class Diagnostics {
    constructor() {
        this.listeners = new Set();
    }
    connect(listener) {
        this.listeners.add(listener);
    }
    disconnect(listener) {
        this.listeners.delete(listener);
    }
    report(obj) {
        for (const listener of this.listeners) {
            listener(obj);
        }
    }
}
Diagnostics.__name__ = "Diagnostics";
export const diagnostics = new Diagnostics();
//# sourceMappingURL=diagnostics.js.map