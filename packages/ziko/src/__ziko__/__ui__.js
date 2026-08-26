export class UIStore extends Array {
    constructor(...args) {
        super(...args); 
    }
    clear(){
        this.length = 0;
        return this;
    }
    getItemById(id) {
        return this.find(n => n.element.id === id);
    }
    getItemsByTagName(tag) {
        return this.filter(n => n.element.tagName.toLowerCase() === tag.toLowerCase());
    }
    getElementsByClassName(className) {
        return this.filter(n => n.element.classList?.contains(className));
    }
    querySelector(selector) {
        const el = globalThis?.document?.querySelector(selector);
        if (!el) return null;
        return this.find(ui => ui.element === el) || null;
    }
    querySelectorAll(selector) {
        const els = globalThis?.document?.querySelectorAll(selector);
        return Array.from(els)
            .map(el => this.find(ui => ui.element === el))
            .filter(Boolean);
    }
}

// create the singleton
export const __UI__ = new UIStore();
