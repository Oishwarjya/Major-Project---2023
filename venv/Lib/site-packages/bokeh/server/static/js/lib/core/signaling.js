// Based on https://github.com/phosphorjs/phosphor/blob/master/packages/signaling/src/index.ts
import { defer } from "./util/defer";
import { find, remove_by } from "./util/array";
export class Signal {
    constructor(sender, name) {
        this.sender = sender;
        this.name = name;
    }
    connect(slot, context = null) {
        if (!receivers_for_sender.has(this.sender)) {
            receivers_for_sender.set(this.sender, []);
        }
        const receivers = receivers_for_sender.get(this.sender);
        if (find_connection(receivers, this, slot, context) != null) {
            return false;
        }
        const receiver = context ?? slot;
        if (!senders_for_receiver.has(receiver)) {
            senders_for_receiver.set(receiver, []);
        }
        const senders = senders_for_receiver.get(receiver);
        const connection = { signal: this, slot, context };
        receivers.push(connection);
        senders.push(connection);
        return true;
    }
    disconnect(slot, context = null) {
        const receivers = receivers_for_sender.get(this.sender);
        if (receivers == null || receivers.length === 0) {
            return false;
        }
        const connection = find_connection(receivers, this, slot, context);
        if (connection == null) {
            return false;
        }
        const receiver = context ?? slot;
        const senders = senders_for_receiver.get(receiver);
        connection.signal = null;
        schedule_cleanup(receivers);
        schedule_cleanup(senders);
        return true;
    }
    emit(args) {
        const receivers = receivers_for_sender.get(this.sender) ?? [];
        for (const { signal, slot, context } of receivers) {
            if (signal === this) {
                slot.call(context, args, this.sender);
            }
        }
    }
}
Signal.__name__ = "Signal";
export class Signal0 extends Signal {
    emit() {
        super.emit(undefined);
    }
}
Signal0.__name__ = "Signal0";
(function (Signal) {
    function disconnect_between(sender, receiver) {
        const receivers = receivers_for_sender.get(sender);
        if (receivers == null || receivers.length === 0)
            return;
        const senders = senders_for_receiver.get(receiver);
        if (senders == null || senders.length === 0)
            return;
        for (const connection of senders) {
            if (connection.signal == null)
                return;
            if (connection.signal.sender === sender)
                connection.signal = null;
        }
        schedule_cleanup(receivers);
        schedule_cleanup(senders);
    }
    Signal.disconnect_between = disconnect_between;
    function disconnect_sender(sender) {
        const receivers = receivers_for_sender.get(sender);
        if (receivers == null || receivers.length === 0)
            return;
        for (const connection of receivers) {
            if (connection.signal == null)
                return;
            const receiver = connection.context ?? connection.slot;
            connection.signal = null;
            schedule_cleanup(senders_for_receiver.get(receiver));
        }
        schedule_cleanup(receivers);
    }
    Signal.disconnect_sender = disconnect_sender;
    function disconnect_receiver(receiver, slot, except_senders) {
        const senders = senders_for_receiver.get(receiver);
        if (senders == null || senders.length === 0)
            return;
        for (const connection of senders) {
            if (connection.signal == null)
                return;
            if (slot != null && connection.slot != slot)
                continue;
            const sender = connection.signal.sender;
            if (except_senders != null && except_senders.has(sender))
                continue;
            connection.signal = null;
            schedule_cleanup(receivers_for_sender.get(sender));
        }
        schedule_cleanup(senders);
    }
    Signal.disconnect_receiver = disconnect_receiver;
    function disconnect_all(obj) {
        const receivers = receivers_for_sender.get(obj);
        if (receivers != null && receivers.length !== 0) {
            for (const connection of receivers) {
                connection.signal = null;
            }
            schedule_cleanup(receivers);
        }
        const senders = senders_for_receiver.get(obj);
        if (senders != null && senders.length !== 0) {
            for (const connection of senders) {
                connection.signal = null;
            }
            schedule_cleanup(senders);
        }
    }
    Signal.disconnect_all = disconnect_all;
})(Signal || (Signal = {}));
export function Signalable() {
    return class {
        connect(signal, slot) {
            return signal.connect(slot, this);
        }
        disconnect(signal, slot) {
            return signal.disconnect(slot, this);
        }
    };
}
/** @internal */
export const receivers_for_sender = new WeakMap();
const senders_for_receiver = new WeakMap();
function find_connection(conns, signal, slot, context) {
    return find(conns, conn => conn.signal === signal && conn.slot === slot && conn.context === context);
}
const dirty_set = new Set();
function schedule_cleanup(connections) {
    if (dirty_set.size === 0) {
        (async () => {
            await defer();
            cleanup_dirty_set();
        })();
    }
    dirty_set.add(connections);
}
function cleanup_dirty_set() {
    for (const connections of dirty_set) {
        remove_by(connections, (connection) => connection.signal == null);
    }
    dirty_set.clear();
}
//# sourceMappingURL=signaling.js.map