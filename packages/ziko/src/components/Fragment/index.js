import { UIElement } from "../../dom/UIElement/index.js";

export class UIFragment extends UIElement{
    constructor(...items){
        super({ element : document.createDocumentFragment()})
        this.append(...items);
    }
    isFragment(){
        return true
    }
}

export const Fragment = (...items) => new UIFragment(...items)