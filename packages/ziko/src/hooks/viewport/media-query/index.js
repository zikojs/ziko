/*
 [
    {
        query: '(min-width: 600px)',
        callback: () => console.log(1)
    },
    {
        query: '(max-width: 300px)',
        callback: () => console.log(2)
    }
 ]
*/

export class MediaQuery {
    #rules = [];
    #fallback;
    #activeRule = null;
    #listeners = new Set();
    #destroyed = false;
    #initialized = false;

    constructor(rules = [], fallback = () => {}) {
        if (!Array.isArray(rules)) {
            throw new TypeError("rules must be an array");
        }

        if (typeof fallback !== "function") {
            throw new TypeError("fallback must be a function");
        }

        this.#fallback = fallback;

        this.#rules = rules.map(({ query, callback }) => {
            if (typeof query !== "string" || !query) {
                throw new TypeError("Invalid media query");
            }

            if (typeof callback !== "function") {
                throw new TypeError(`Invalid callback for: ${query}`);
            }

            const media = matchMedia(query);
            const listener = () => this.#update();

            media.addEventListener("change", listener);

            return { query, callback, media, listener };
        });

        // Initial execution, without waiting for resize.
        this.#update();
    }

    #update() {
        if (this.#destroyed) return;

        const nextRule =
            this.#rules.find(rule => rule.media.matches) ?? null;

        if (this.#initialized && nextRule === this.#activeRule) {
            return;
        }

        const previousRule = this.#activeRule;

        this.#activeRule = nextRule;
        this.#initialized = true;

        if (nextRule) {
            nextRule.callback();
        } else {
            this.#fallback();
        }

        for (const listener of this.#listeners) {
            listener(nextRule, previousRule);
        }
    }

    get current() {
        return this.#activeRule?.query ?? null;
    }

    get matches() {
        return this.#activeRule !== null;
    }

    onChange(callback) {
        if (typeof callback !== "function") {
            throw new TypeError("callback must be a function");
        }

        this.#listeners.add(callback);
        return () => this.#listeners.delete(callback);
    }

    update() {
        this.#update();
        return this;
    }

    destroy() {
        if (this.#destroyed) return;

        this.#destroyed = true;

        for (const { media, listener } of this.#rules) {
            media.removeEventListener("change", listener);
        }

        this.#rules = [];
        this.#listeners.clear();
        this.#activeRule = null;
    }
}

export const useMediaQuery = (rules, fallback) =>
    new MediaQuery(rules, fallback);