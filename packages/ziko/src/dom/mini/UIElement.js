import { UIElementCore } from "../constructors/UIElementCore.js";
class UIElement extends UIElementCore{
    constructor({element, name, type, render}){
        super({element, name, type, render})
    }
}

export {
    UIElement
}