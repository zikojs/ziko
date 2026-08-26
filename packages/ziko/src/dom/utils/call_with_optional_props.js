import { is_primitive } from "./checkers.js";
export const call_with_optional_props = (Component) => {
    return (...args) => {
        const first = args[0];

        const isChild = first?.isUIElement?.() || is_primitive(first);

        if (isChild) {
            return new Component({}, ...args);
        }

        return new Component(first, ...args.slice(1));
    };
};