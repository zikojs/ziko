import {UIElement} from "../../dom/constructors/UIElement.js";
export class UISuspense extends UIElement{
    constructor(fallback_ui, callback){
        super({element : "div", name : "suspense"})
        this.setAttr({
            dataTemp : "suspense"
        })
        this.fallback_ui = fallback_ui
        this.append(fallback_ui);
        (async ()=>{
            try{
                const ui = await callback()
                fallback_ui.unmount()
                this.append(ui)
            }
            catch(error){
                console.log({error})
            }
        })()
    }
}

export const Suspense = (fallback_ui, callback) => new UISuspense(fallback_ui, callback);