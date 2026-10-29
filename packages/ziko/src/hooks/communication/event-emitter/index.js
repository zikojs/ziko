
class EventEmitter {
    constructor(maxListeners = 10) {
        this.events = new Map();
        this.maxListeners = maxListeners;
    }
    on(event, listener) {
        if (typeof listener !== "function") {
            throw new TypeError("Listener must be a function");
        }
        let listeners = this.events.get(event);
        if (!listeners) {
            listeners = [];
            this.events.set(event, listeners);
        }
        listeners.push(listener);
        if ( this.maxListeners > 0 && listeners.length > this.maxListeners ) {
            console.warn(
                `Possible memory leak: event '${String(event)}' has ` +
                `more than ${this.maxListeners} listeners.`
            );
        }
        return this;
    }

    once(event, listener) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            listener(...args);
        };

        // Allow off(event, originalListener) to work.
        wrapper.listener = listener;

        return this.on(event, wrapper);
    }

    off(event, listener) {
        const listeners = this.events.get(event);
        if (!listeners) return this;

        const index = listeners.findIndex(
            fn => fn === listener || fn.listener === listener
        );

        if (index !== -1) {
            listeners.splice(index, 1);
        }

        if (listeners.length === 0) {
            this.events.delete(event);
        }

        return this;
    }

    emit(event, ...args) {
        const listeners = this.events.get(event);
        if (!listeners?.length) return false;

        // Snapshot protects iteration from listener mutations.
        for (const listener of [...listeners]) {
            try {
                listener(...args);
            } catch (error) {
                console.error(
                    `Error in listener for '${String(event)}':`,
                    error
                );
            }
        }

        return true;
    }

    remove(event) {
        this.events.delete(event);
        return this;
    }

    clear() {
        this.events.clear();
        return this;
    }

    setMaxListeners(max) {
        if (!Number.isInteger(max) || max < 0) {
            throw new RangeError(
                "maxListeners must be a non-negative integer"
            );
        }

        this.maxListeners = max;
        return this;
    }
}

const useEventEmitter = (maxListeners) =>
    new EventEmitter(maxListeners);

export { EventEmitter, useEventEmitter };
