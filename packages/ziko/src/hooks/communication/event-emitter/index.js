export class EventEmitter {
    constructor(maxListeners = 10) {
        this.events = new Map();
        this.setMaxListeners(maxListeners);
    }
    on(event, listener, { signal } = {}) {
        if (typeof listener !== "function") throw new TypeError("Listener must be a function");
        if (signal !== undefined && (
            typeof signal.addEventListener !== "function" ||
            typeof signal.removeEventListener !== "function"
        )) throw new TypeError("signal must be an AbortSignal");
        // Do not register listeners for an already-aborted signal.
        if (signal?.aborted) return this;
        let listeners = this.events.get(event);
        if (!listeners) {
            listeners = [];
            this.events.set(event, listeners);
        }
        const entry = {
            listener,
            signal,
            abortHandler: null
        };
        if (signal) {
            entry.abortHandler = () => this.#removeEntry(event, entry);
            signal.addEventListener("abort", entry.abortHandler, {
                once: true
            });
        }
        listeners.push(entry);
        if ( this.maxListeners > 0 && listeners.length > this.maxListeners) {
            console.warn(
                `Possible memory leak: event '${String(event)}' has ` +
                `more than ${this.maxListeners} listeners.`
            );
        }
        return this;
    }
    once(event, listener, options = {}) {
        if (typeof listener !== "function") throw new TypeError("Listener must be a function");
        const wrapper = (...args) => {
            this.off(event, wrapper);
            listener(...args);
        };
        wrapper.listener = listener;
        return this.on(event, wrapper, options);
    }
    off(event, listener) {
        const listeners = this.events.get(event);
        if (!listeners) return this;
        for (const entry of [...listeners]) {
            if ( entry.listener === listener || entry.listener.listener === listener) this.#removeEntry(event, entry);
        }
        return this;
    }
    emit(event, ...args) {
        const listeners = [
            ...(this.events.get(event) ?? [])
        ];
        // Wildcard callbacks receive (eventName, ...args).
        if (event !== "*") listeners.push(...(this.events.get("*") ?? []));
        if (listeners.length === 0) return false;
        for (const entry of listeners) {
            // A previous listener may have removed or aborted this one.
            const current = this.events.get(
                entry === undefined ? undefined :
                this.#findEvent(entry)
            );
            if (!current?.includes(entry)) continue;
            try {
                if (entry.signal?.aborted) continue;
                if (this.#findEvent(entry) === "*") entry.listener(event, ...args);
                else entry.listener(...args);
            } catch (error) {
                console.error(
                    `Error in listener for '${String(event)}':`,
                    error
                );
            }
        }
        return true;
    }
    waitFor(event, { signal, timeout } = {}) {
        return new Promise((resolve, reject) => {
            if (signal?.aborted) {
                reject(this.#abortError(signal));
                return;
            }
            if ( timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
                reject(new RangeError( "timeout must be a non-negative finite number"));
                return;
            }
            let timer;
            const cleanup = () => {
                this.off(event, handler);
                signal?.removeEventListener("abort", onAbort);
                if (timer !== undefined) clearTimeout(timer);
            };
            const handler = (...args) => {
                cleanup();
                resolve( args.length === 0 ? undefined : args.length === 1 ? args[0] : args);
            };
            const onAbort = () => {
                cleanup();
                reject(this.#abortError(signal));
            };
            this.on(event, handler, { signal });
            // If the signal aborts, on() removes the handler.
            // This listener also rejects the pending Promise.
            signal?.addEventListener("abort", onAbort, {
                once: true
            });
            if (timeout !== undefined) {
                timer = setTimeout(() => {
                    cleanup();
                    const error = new Error(`Timed out waiting for event '${String(event)}'`);
                    error.name = "TimeoutError";
                    reject(error);
                }, timeout);
            }
        });
    }
    remove(event) {
        const listeners = this.events.get(event);
        if (listeners) {
            for (const entry of [...listeners]) this.#removeEntry(event, entry);
        }
        return this;
    }

    removeAllListeners(event) {
        if (arguments.length === 0) {
            for (const name of this.events.keys()) this.remove(name);
        } 
        else this.remove(event);
        return this;
    }
    listenerCount(event) {
        return this.events.get(event)?.length ?? 0;
    }
    eventNames() {
        return [...this.events.keys()];
    }
    clear() {
        return this.removeAllListeners();
    }
    setMaxListeners(max) {
        if (!Number.isInteger(max) || max < 0) throw new RangeError("maxListeners must be a non-negative integer");
        this.maxListeners = max;
        return this;
    }
    #removeEntry(event, entry) {
        const listeners = this.events.get(event);
        if (!listeners) return;
        const index = listeners.indexOf(entry);
        if (index === -1) return;
        listeners.splice(index, 1);
        entry.signal?.removeEventListener("abort", entry.abortHandler);
        if (listeners.length === 0) this.events.delete(event);
    }
    #findEvent(entry) {
        for (const [event, listeners] of this.events) {
            if (listeners.includes(entry)) return event;
        }
        return undefined;
    }
    #abortError(signal) {
        if (signal?.reason instanceof Error) return signal.reason;
        const error = new Error("The operation was aborted");
        error.name = "AbortError";
        return error;
    }
}
export const useEventEmitter = (maxListeners) => new EventEmitter(maxListeners);
