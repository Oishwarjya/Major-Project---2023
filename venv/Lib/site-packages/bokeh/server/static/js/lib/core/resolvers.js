export class ModelResolver {
    constructor(parent, models = []) {
        this.parent = parent;
        this._known_models = new Map();
        for (const model of models) {
            this.register(model);
        }
    }
    get(name) {
        return this._known_models.get(name) ?? this.parent?.get(name) ?? null;
    }
    register(model, force = false) {
        const name = model.__qualified__;
        if (force || this.get(name) == null)
            this._known_models.set(name, model);
        else
            console.warn(`Model '${name}' was already registered with this resolver`);
    }
    get names() {
        return [...this._known_models.keys()];
    }
}
ModelResolver.__name__ = "ModelResolver";
//# sourceMappingURL=resolvers.js.map