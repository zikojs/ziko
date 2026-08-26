import { UIElement } from "../../constructors/UIElement.js";

class UISwitch extends UIElement{
    constructor(key, cases){
        super()
        this.key = key; 
        this.cases = cases;
        this.init()
    }
    init(){
        Object.values(this.cases).filter(n=>n != this.current).forEach(n=>n.unmount())
        super.init(this.current.element)
    }
    get current(){
        const matched = Object.keys(this.cases).find(n => n == this.key) ?? 'default'
        return this.cases[matched]
    }
    updateKey(key){
        this.key = key;
        this.replaceElementWith(this.current.element)
        // this.cache.element.replaceWith(this.current.element)
        // this.cache.element = this.current.element;
        return this;
    }
    
}

const Switch=({key, cases})=> new UISwitch(key, cases)

export{
    UISwitch, 
    Switch
}

// export const Switch=({key, cases}) => {
//     const matched = Object.keys(cases).find(n => n == key) ?? 'default';
//     return this.cases[matched]()
// }