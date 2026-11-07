import { is_primitive } from "../../internal-utils/checkers/index.js";
import { isStateGetter } from '../../hooks/state/use-state/index.js'
import { UIElement } from '../UIElement/index.js'
export const callWithOptionalProps = (Component) => {
    return (...args) => {
        const first = args[0];
        const isChild = first?.isUIElement?.() || is_primitive(first);
        if (isChild) 
            return new Component({}, ...args);
        return new Component(first, ...args.slice(1));
    };
};
export const isUIItem = item => {
    return (
        ['string', 'number'].includes(typeof item) ||
        item instanceof UIElement ||
        isStateGetter(item) ||
        isHTMLElement(item) ||
        item instanceof Promise
    )
}

export const isHTMLElement = value =>
  typeof globalThis.HTMLElement === 'function' &&
  value instanceof globalThis.HTMLElement;