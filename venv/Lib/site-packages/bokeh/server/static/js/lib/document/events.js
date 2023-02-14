import { equals } from "../core/util/eq";
import { serialize } from "../core/serialization";
export class DocumentEvent {
    constructor(document) {
        this.document = document;
    }
    get [Symbol.toStringTag]() {
        return this.constructor.__name__;
    }
    [equals](that, cmp) {
        return cmp.eq(this.document, that.document);
    }
}
DocumentEvent.__name__ = "DocumentEvent";
export class DocumentEventBatch extends DocumentEvent {
    constructor(document, events) {
        super(document);
        this.events = events;
    }
    [equals](that, cmp) {
        return super[equals](that, cmp) &&
            cmp.eq(this.events, that.events);
    }
}
DocumentEventBatch.__name__ = "DocumentEventBatch";
export class DocumentChangedEvent extends DocumentEvent {
}
DocumentChangedEvent.__name__ = "DocumentChangedEvent";
export class MessageSentEvent extends DocumentChangedEvent {
    constructor(document, msg_type, msg_data) {
        super(document);
        this.msg_type = msg_type;
        this.msg_data = msg_data;
        this.kind = "MessageSent";
    }
    [equals](that, cmp) {
        return super[equals](that, cmp) &&
            cmp.eq(this.msg_type, that.msg_type) &&
            cmp.eq(this.msg_data, that.msg_data);
    }
    [serialize](serializer) {
        return {
            kind: this.kind,
            msg_type: this.msg_type,
            msg_data: serializer.encode(this.msg_data),
        };
    }
}
MessageSentEvent.__name__ = "MessageSentEvent";
export class ModelChangedEvent extends DocumentChangedEvent {
    constructor(document, model, attr, value) {
        super(document);
        this.model = model;
        this.attr = attr;
        this.value = value;
        this.kind = "ModelChanged";
    }
    [equals](that, cmp) {
        return super[equals](that, cmp) &&
            cmp.eq(this.model, that.model) &&
            cmp.eq(this.attr, that.attr) &&
            cmp.eq(this.value, that.value);
    }
    [serialize](serializer) {
        return {
            kind: this.kind,
            model: this.model.ref(),
            attr: this.attr,
            new: serializer.encode(this.value),
        };
    }
}
ModelChangedEvent.__name__ = "ModelChangedEvent";
export class ColumnDataChangedEvent extends DocumentChangedEvent {
    constructor(document, model, attr, data, cols) {
        super(document);
        this.model = model;
        this.attr = attr;
        this.data = data;
        this.cols = cols;
        this.kind = "ColumnDataChanged";
    }
    [equals](that, cmp) {
        return super[equals](that, cmp) &&
            cmp.eq(this.model, that.model) &&
            cmp.eq(this.attr, that.attr) &&
            cmp.eq(this.data, that.data) &&
            cmp.eq(this.cols, that.cols);
    }
    [serialize](serializer) {
        return {
            kind: this.kind,
            model: this.model.ref(),
            attr: this.attr,
            data: serializer.encode(this.data),
            cols: this.cols,
        };
    }
}
ColumnDataChangedEvent.__name__ = "ColumnDataChangedEvent";
export class ColumnsStreamedEvent extends DocumentChangedEvent {
    constructor(document, model, attr, data, rollover) {
        super(document);
        this.model = model;
        this.attr = attr;
        this.data = data;
        this.rollover = rollover;
        this.kind = "ColumnsStreamed";
    }
    [equals](that, cmp) {
        return super[equals](that, cmp) &&
            cmp.eq(this.model, that.model) &&
            cmp.eq(this.attr, that.attr) &&
            cmp.eq(this.data, that.data) &&
            cmp.eq(this.rollover, that.rollover);
    }
    [serialize](serializer) {
        return {
            kind: this.kind,
            model: this.model.ref(),
            attr: this.attr,
            data: serializer.encode(this.data),
            rollover: this.rollover,
        };
    }
}
ColumnsStreamedEvent.__name__ = "ColumnsStreamedEvent";
export class ColumnsPatchedEvent extends DocumentChangedEvent {
    constructor(document, model, attr, patches) {
        super(document);
        this.model = model;
        this.attr = attr;
        this.patches = patches;
        this.kind = "ColumnsPatched";
    }
    [equals](that, cmp) {
        return super[equals](that, cmp) &&
            cmp.eq(this.model, that.model) &&
            cmp.eq(this.attr, that.attr) &&
            cmp.eq(this.patches, that.patches);
    }
    [serialize](serializer) {
        return {
            kind: this.kind,
            attr: this.attr,
            model: this.model.ref(),
            patches: serializer.encode(this.patches),
        };
    }
}
ColumnsPatchedEvent.__name__ = "ColumnsPatchedEvent";
export class TitleChangedEvent extends DocumentChangedEvent {
    constructor(document, title) {
        super(document);
        this.title = title;
        this.kind = "TitleChanged";
    }
    [equals](that, cmp) {
        return super[equals](that, cmp) &&
            cmp.eq(this.title, that.title);
    }
    [serialize](_serializer) {
        return {
            kind: this.kind,
            title: this.title,
        };
    }
}
TitleChangedEvent.__name__ = "TitleChangedEvent";
export class RootAddedEvent extends DocumentChangedEvent {
    constructor(document, model) {
        super(document);
        this.model = model;
        this.kind = "RootAdded";
    }
    [equals](that, cmp) {
        return super[equals](that, cmp) &&
            cmp.eq(this.model, that.model);
    }
    [serialize](serializer) {
        return {
            kind: this.kind,
            model: serializer.encode(this.model),
        };
    }
}
RootAddedEvent.__name__ = "RootAddedEvent";
export class RootRemovedEvent extends DocumentChangedEvent {
    constructor(document, model) {
        super(document);
        this.model = model;
        this.kind = "RootRemoved";
    }
    [equals](that, cmp) {
        return super[equals](that, cmp) &&
            cmp.eq(this.model, that.model);
    }
    [serialize](_serializer) {
        return {
            kind: this.kind,
            model: this.model.ref(),
        };
    }
}
RootRemovedEvent.__name__ = "RootRemovedEvent";
//# sourceMappingURL=events.js.map