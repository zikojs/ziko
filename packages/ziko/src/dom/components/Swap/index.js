import { UIElement } from "../../constructors/UIElement.js";
import { call_with_optional_props } from '../../utils/index.js';

export class UISwap extends UIElement {
    #DISPLAYS_MAP = new WeakMap()
    constructor({ activeIndex = 0 } = {}, ...items) {
        super({ element: 'div' });
        this.style({ display: 'contents' });
        
        this.states = {
            activeIndex
        };
        
        this.append(...items);
        requestAnimationFrame(() => {
            this.render();
        });
    }
    get activeItem(){
        return this.items[this.states.activeIndex]
    }
    render() {
        this.items.forEach((n, i) => {

            const initialDisplay = getComputedStyle(n.element).display;
            this.#DISPLAYS_MAP.set(n, initialDisplay);

            if (i !== this.states.activeIndex) {
                n.style({ display: 'none' });
            }
        });
    }
    get DS(){
        return this.#DISPLAYS_MAP
    }
    next(n = 1) {
        return this.activate(this.states.activeIndex + n);
    }
    previous(n = 1) {
        return this.activate(this.states.activeIndex - n);
    }
    activate(index) {
        if (!this.items.length) return this;

        const currentItem = this.items.at(this.states.activeIndex);

        if (currentItem) {
            currentItem.style({ display: 'none' });
        }

        const len = this.items.length;
        this.states.activeIndex = ((index % len) + len) % len;

        const activeItem = this.items.at(this.states.activeIndex);
        if (activeItem) {
            const restoredDisplay = this.#DISPLAYS_MAP.get(activeItem) || 'block';
            activeItem.style({ display: restoredDisplay === 'none' ? 'block' : restoredDisplay });
        }

        return this;
    }
}

export const Swap = call_with_optional_props(UISwap);