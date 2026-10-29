
const getStyleTarget = (target) => {
    if (target?.nodeType === 9) {
        // Document → documentElement
        return target.documentElement?.style;
    }

    if (target?.nodeType === 1 && target.style) {
        // Element → element.style
        return target.style;
    }

    throw new TypeError(
        "target must be a Document or an Element"
    );
};

function ValidateCssPropsFn(PropsMap) {
    const style = globalThis.document?.documentElement?.style;

    if (!style) {
        throw new Error("CSS property validation requires a DOM");
    }

    for (const key of Object.keys(PropsMap)) {
        if (!(key in style)) {
            throw new Error(`Invalid CSS property: "${key}"`);
        }
    }
}

export class CssVars {
    #data = {};
    #style;
    #namespace;
    #validCssProps;

    constructor(initialData, {
        namespace = "ziko",
        validCssProps = false,
        target = globalThis.document
    } = {}) {
        if (!initialData || typeof initialData !== "object") {
            throw new TypeError("initialData must be an object");
        }

        this.#namespace = namespace;
        this.#validCssProps = validCssProps;
        this.#style = getStyleTarget(target);

        if (!this.#style) {
            throw new Error("Unable to resolve the CSS style target");
        }

        this.#apply(initialData);

        const vars = new Proxy({}, {
            get: (_, prop) => {
                if (typeof prop !== "string") return undefined;

                return `var(${this.#getCssName(prop)})`;
            },

            has: (_, prop) =>
                typeof prop === "string" &&
                Object.hasOwn(this.#data, prop),

            ownKeys: () => Reflect.ownKeys(this.#data),

            getOwnPropertyDescriptor: (_, prop) => {
                if (
                    typeof prop === "string" &&
                    Object.hasOwn(this.#data, prop)
                ) {
                    return {
                        configurable: true,
                        enumerable: true,
                        value: `var(${this.#getCssName(prop)})`
                    };
                }
            }
        });

        const setter = (nextData) => {
            const updates = typeof nextData === "function"
                ? nextData({ ...this.#data })
                : nextData;

            if (!updates || typeof updates !== "object") {
                throw new TypeError("CSS variable updates must be an object");
            }

            this.#apply(updates);
            return vars;
        };

        return [vars, setter];
    }

    #getCssName(prop) {
        return this.#namespace
            ? `--${this.#namespace}-${prop}`
            : `--${prop}`;
    }

    #apply(updates) {
        if (this.#validCssProps) {
            ValidateCssPropsFn(updates);
        }

        for (const [prop, value] of Object.entries(updates)) {
            this.#style.setProperty(
                this.#getCssName(prop),
                String(value)
            );

            this.#data[prop] = value;
        }
    }
}

export const useCssVars = (initialData, options = {}) => new CssVars(initialData, options);
