import { UIElement } from "../../dom/UIElement/index.js";
import { callWithOptionalProps, isUIItem } from "../../dom/utils/index.js";
export class UIView extends UIElement{
    constructor(...items){
        super({element : 'div', name : 'view'})
        this.append(...items)
    }
}

export const View = callWithOptionalProps(UIElement);