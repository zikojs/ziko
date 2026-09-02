import { UIElement } from "../../dom/UIElement/index.js";
import { call_with_optional_props } from '../../dom/internal-utils/call_with_optional_props.js';

export class UIView extends UIElement{
    constructor(...items){
        super({element : 'div', name : 'view'})
        this.append(...items)
    }
}

export const View = (...items) => call_with_optional_props(UIElement);