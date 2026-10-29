
class IPC {
    #channel;
    #name;
    #handlers = new Map();
    #currentRooms = new Set();
    #uuid;
    #closed = false;

    constructor(name = "") {
        this.#name = name;
        this.#uuid = globalThis.crypto?.randomUUID?.()
            ?? `ziko-${Date.now()}-${Math.random()}`;

        this.#channel = new BroadcastChannel(name);

        this.#channel.addEventListener("message", ({ data }) => {
            if (this.#closed || !data) return;
            if (data.userId === this.#uuid) return;

            const { event, payload, rooms } = data;

            // Targeted messages require the receiver to have joined
            // at least one of the requested rooms.
            if (
                rooms?.length &&
                !rooms.some(room => this.#currentRooms.has(room))
            ) {
                return;
            }

            const handlers = this.#handlers.get(event);
            if (!handlers) return;

            for (const entry of [...handlers]) {
                // Optional room filters on individual handlers.
                if (
                    entry.rooms?.length &&
                    rooms?.length &&
                    !rooms.some(room => entry.rooms.includes(room))
                ) {
                    continue;
                }

                try {
                    entry.fn(payload);
                } catch (error) {
                    console.error(
                        `IPC handler error for "${event}":`,
                        error
                    );
                }
            }
        });
    }

    /**
     * Target one or more rooms.
     * Returns a temporary emitter, so targets don't leak
     * into subsequent calls.
     */
    to(rooms) {
        this.#assertOpen();

        const targets = new Set(this.#normalizeRooms(rooms));
        const ipc = this;

        const operator = {
            to(nextRooms) {
                for (const room of ipc.#normalizeRooms(nextRooms)) {
                    targets.add(room);
                }
                return operator;
            },

            emit(event, payload) {
                ipc.#emit(event, payload, [...targets]);
                return operator;
            }
        };

        return operator;
    }

    /**
     * Create a separate namespace backed by its own channel.
     */
    of(namespace) {
        this.#assertOpen();

        if (typeof namespace !== "string" || !namespace.trim()) {
            throw new TypeError("namespace must be a non-empty string");
        }

        return new IPC(`${this.#name}:${namespace}`);
    }

    emit(event, payload) {
        this.#assertOpen();
        this.#emit(event, payload);
        return this;
    }

    #emit(event, payload, rooms) {
        this.#channel.postMessage({
            event,
            payload,
            userId: this.#uuid,
            rooms: rooms?.length ? rooms : undefined
        });
    }

    on(event, handler, rooms) {
        this.#assertOpen();

        if (typeof handler !== "function") {
            throw new TypeError("handler must be a function");
        }

        const entry = {
            fn: handler,
            rooms: this.#normalizeRooms(rooms)
        };

        if (!this.#handlers.has(event)) {
            this.#handlers.set(event, []);
        }

        this.#handlers.get(event).push(entry);
        return this;
    }

    once(event, handler, rooms) {
        const wrapper = (payload) => {
            this.off(event, wrapper);
            handler(payload);
        };

        wrapper.listener = handler;

        return this.on(event, wrapper, rooms);
    }

    off(event, handler) {
        this.#assertOpen();

        const handlers = this.#handlers.get(event);
        if (!handlers) return this;

        const remaining = handlers.filter(
            entry =>
                entry.fn !== handler &&
                entry.fn.listener !== handler
        );

        if (remaining.length) {
            this.#handlers.set(event, remaining);
        } else {
            this.#handlers.delete(event);
        }

        return this;
    }

    join(...rooms) {
        this.#assertOpen();

        for (const room of rooms.flat()) {
            this.#currentRooms.add(room);
        }

        return this;
    }

    leave(...rooms) {
        this.#assertOpen();

        if (rooms.length === 0) {
            this.#currentRooms.clear();
        } else {
            for (const room of rooms.flat()) {
                this.#currentRooms.delete(room);
            }
        }

        return this;
    }

    close() {
        if (this.#closed) return this;

        this.#closed = true;
        this.#channel.close();
        this.#handlers.clear();
        this.#currentRooms.clear();

        return this;
    }

    #normalizeRooms(rooms) {
        if (rooms == null) return [];
        if (typeof rooms === "string") return [rooms];

        if (
            Array.isArray(rooms) &&
            rooms.every(room => typeof room === "string")
        ) {
            return rooms;
        }

        throw new TypeError(
            "rooms must be a string or an array of strings"
        );
    }

    #assertOpen() {
        if (this.#closed) {
            throw new Error("IPC channel is closed");
        }
    }
}

const useIPC = (name = "") => new IPC(name);

export { IPC, useIPC };
