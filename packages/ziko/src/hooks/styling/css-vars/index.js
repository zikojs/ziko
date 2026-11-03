import { UIElement } from '../../../dom/UIElement/index.js'
export class CssVars {
    #data = {};
    #style;
    #namespace;
    constructor(initialData, { namespace = "ziko", target = globalThis.document} = {}) {
        this.#namespace = namespace;
        this.#style = getStyleTarget(target);
        this.#apply(initialData);
        const vars = new Proxy({}, {
            get: (_, prop) => {
                if (typeof prop !== "string") return undefined;
                return `var(${this.#getCssName(prop)})`;
            },
            has: (_, prop) => typeof prop === "string" && Object.hasOwn(this.#data, prop),
            ownKeys: () => Reflect.ownKeys(this.#data),
            getOwnPropertyDescriptor: (_, prop) => {
                if (typeof prop === "string" && Object.hasOwn(this.#data, prop)) {
                    return {
                        configurable: true,
                        enumerable: true,
                        value: `var(${this.#getCssName(prop)})`
                    };
                }
            }
        });
        const setter = (nextData) => {
            const updates = typeof nextData === "function" ? nextData({ ...this.#data }) : nextData;
            this.#apply(updates);
            return vars;
        };
        return [vars, setter];
    }
    #getCssName(prop) {
        return this.#namespace ? `--${this.#namespace}-${prop}` : `--${prop}`;
    }
    #apply(updates) {
        for (const [prop, value] of Object.entries(updates)) {
            this.#style.setProperty(this.#getCssName(prop), String(value));
            this.#data[prop] = value;
        }
    }
}

const getStyleTarget = (target) => {
    if(target instanceof UIElement) target = target.element;
    if(target?.nodeType === 9) return target.documentElement?.style;
    if(target?.nodeType === 1) return target.style;
    return target?.style;
};

export const useCssVars = (initialData, options = {}) => new CssVars(initialData, options);