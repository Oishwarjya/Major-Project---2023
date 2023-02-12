export function extend(ctor, ...mixins) {
    for (const mixin of mixins) {
        for (const name of Object.getOwnPropertyNames(mixin.prototype)) {
            if (name == "constructor")
                continue;
            Object.defineProperty(ctor.prototype, name, Object.getOwnPropertyDescriptor(mixin.prototype, name) ?? Object.create(null));
        }
    }
}
//# sourceMappingURL=class.js.map