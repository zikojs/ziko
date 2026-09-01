import { UIElement } from "../../constructors/UIElement.js";
export class UIView extends UIElement{
    constructor(...items){
        super({element : 'div', name : 'view'})
        this.append(...items)
    }
}

export const View = (...items) => new UIView(...items);