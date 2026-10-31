export class ContainerQuery {
    #element;
    #rules = [];
    #fallback;
    #observer;
    #activeRule = null;
    #listeners = new Set();
    #initialized = false;
    #destroyed = false;
    #width = 0;
    #height = 0;

    constructor(element, rules = [], fallback = () => {}) {
        if (!(element instanceof Element)) {
            throw new TypeError("A valid container element is required");
        }

        if (!Array.isArray(rules)) {
            throw new TypeError("rules must be an array");
        }

        if (typeof fallback !== "function") {
            throw new TypeError("fallback must be a function");
        }

        this.#element = element;
        this.#fallback = fallback;

        this.#rules = rules.map(({ query, callback }) => {
            if (typeof query !== "function") {
                throw new TypeError("Each rule requires a query function");
            }

            if (typeof callback !== "function") {
                throw new TypeError("Each rule requires a callback");
            }

            return { query, callback };
        });

        this.#observer = new ResizeObserver(entries => {
            const entry = entries[0];
            if (!entry) return;

            this.#width = entry.contentRect.width;
            this.#height = entry.contentRect.height;

            this.#update();
        });

        const rect = element.getBoundingClientRect();

        this.#width = rect.width;
        this.#height = rect.height;

        this.#observer.observe(element);

        // Initial execution, without waiting for resizing.
        this.#update();
    }

    #getMatchingRule() {
        return this.#rules.find(({ query }) =>
            query(this.#width, this.#height, this.#element)
        ) ?? null;
    }

    #update() {
        if (this.#destroyed) return;

        const nextRule = this.#getMatchingRule();

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
        return this.#activeRule;
    }

    get matches() {
        return this.#activeRule !== null;
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
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

        this.#observer.disconnect();
        this.#rules = [];
        this.#listeners.clear();
        this.#activeRule = null;
    }
}

export const useContainerQuery = (element, rules, fallback) =>
    new ContainerQuery(element, rules, fallback);
