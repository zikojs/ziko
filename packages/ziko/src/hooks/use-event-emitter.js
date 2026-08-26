class UseEventEmitter {
    constructor(maxListeners = 10) {
        this.events = {};
        this.maxListeners = maxListeners;
    }

    on(event, listener) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
        if (this.events[event].length > this.maxListeners) {
            console.warn(`Warning: Possible memory leak. Event '${event}' has more than ${this.maxListeners} listeners.`);
        }
        return this;
    }

    once(event, listener) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            listener(...args);
        };
        return this.on(event, wrapper);
    }

    off(event, listener) {
        const listeners = this.events[event];
        if (!listeners) return this;

        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }

        return this;
    }

    emit(event, data) {
        const listeners = this.events[event];
        if (!listeners) return false;

        // Make a copy so removing listeners inside callbacks doesn't affect iteration
        [...listeners].forEach(listener => {
            try {
                listener(data);
            } catch (e) {
                console.error(`Error in listener for '${event}':`, e);
            }
        });

        return true;
    }
    remove(event){
        delete this.events[event];  
        return this; 
    }
    clear() {
        this.events = {};
        return this;
    }

    setMaxListeners(max) {
        this.maxListeners = max;
        return this;
    }
}

const useEventEmitter = (maxListeners) => new UseEventEmitter(maxListeners);

export { useEventEmitter };
