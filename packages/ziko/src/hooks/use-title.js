import { useEventEmitter } from "./use-event-emitter.js";

class UseTitle {
    constructor(title = document.title, withEmitter = true) {
        this.cache = {
            emitter: null
        };

        if (withEmitter) this.useEventEmitter();
        this.set(title);
    }

    useEventEmitter() {
        this.cache.emitter = useEventEmitter();
        return this;
    }

    setTitle(title) {
        if (title !== document.title) {
            document.title = title;

            if (this.cache.emitter) {
                this.cache.emitter.emit("ziko:title-changed", title);
            }
        }
        return this;
    }

    get current() {
        return document.title;
    }

    onChange(callback) {
        if (this.cache.emitter) {
            this.cache.emitter.on("ziko:title-changed", callback);
        }
        return this;
    }
}

const useTitle = (title, withEmitter = true) => new UseTitle(title, withEmitter);

export { useTitle };
