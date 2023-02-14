var _a;
import { Callback } from "./callback";
import { HasProps } from "../../core/has_props";
import { logger } from "../../core/logging";
export class SetValue extends Callback {
    constructor(attrs) {
        super(attrs);
    }
    execute() {
        const { obj, attr, value } = this;
        if (attr in obj.properties)
            obj.setv({ [attr]: value });
        else
            logger.error(`${obj.type}.${attr} is not a property`);
    }
}
_a = SetValue;
SetValue.__name__ = "SetValue";
(() => {
    _a.define(({ String, Unknown, Ref }) => ({
        obj: [Ref(HasProps)],
        attr: [String],
        value: [Unknown],
    }));
})();
//# sourceMappingURL=set_value.js.map