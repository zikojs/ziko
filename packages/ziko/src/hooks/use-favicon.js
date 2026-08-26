import { useEventEmitter } from "./use-event-emitter.js";

class UseFavIcon {
    constructor(FavIcon, withEmitter = true) {
        this.#init();
        this.cache = {
            emitter: null
        };
        if (withEmitter) this.useEventEmitter();
        if (FavIcon) this.set(FavIcon);
    }

    #init() {
        let link = document.querySelector("link[rel*='icon']");
        let created = false;

        if (!link) {
            link = document.createElement("link");
            created = true;
        }

        link.type = "image/x-icon";
        link.rel = "shortcut icon";

        if (created) document.head.appendChild(link);

        this.__FavIcon__ = link;
    }

    setFavicon(href) {
        if (href !== this.__FavIcon__.href) {
            this.__FavIcon__.href = href;

            if (this.cache.emitter)
                this.cache.emitter.emit("ziko:favicon-changed", href);
        }
        return this;
    }

    get current() {
        return this.__FavIcon__.href;
    }

    onChange(callback) {
        if (this.cache.emitter)
            this.cache.emitter.on("ziko:favicon-changed", callback);
        return this;
    }

    useEventEmitter() {
        this.cache.emitter = useEventEmitter();
        return this;
    }
    
}

const useFavIcon = (FavIcon, withEmitter = true) => new UseFavIcon(FavIcon, withEmitter);

export { useFavIcon };
