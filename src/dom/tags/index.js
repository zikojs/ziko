import {UIElement} from "../constructors/UIElement.js";
import { HTMLTags, SVGTags, MathMLTags } from "./tags-list.js";
import { isStateGetter } from "../../hooks/use-state.js";

const tags = new Proxy({}, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined;
    let tag = prop.replaceAll("_","-").toLowerCase();
    let type ;
    if(HTMLTags.includes(tag)) type = 'html'
    if(SVGTags.includes(tag)) type = 'svg'
    if(MathMLTags.includes(tag)) type = 'mathml'
    return (...args)=>{
      // Fix undefined
      // console.log(isStateGetter(args[0]))
      // console.log(!!args)
      if(args.length === 0) {
        // console.log('length 0')
        return new UIElement({element : tag, name : tag, type})
      }
      if(
        ['string', 'number'].includes(typeof args[0]) 
        || args[0] instanceof UIElement 
        || isStateGetter(args[0])
      ) return new UIElement({element : tag, name : tag, type}).append(...args);
      // console.log(args[0])
      return new UIElement({element : tag, type}).setAttr(args.shift()).append(...args)
    }
    // if(SVGTags.includes(tag)) return (...args) => new UIElement(tag,"",{el_type : "svg"}).append(...args);
    // return (...args)=>{
    //   if(!(args[0] instanceof UIElement) && args[0] instanceof Object){
    //     let attributes = args.shift()
    //     return new UIElement(tag).setAttr(attributes).append(...args)
    //   }
    //   return new UIElement(tag).append(...args);
    // }
    // // switch(tag){
    //   case "html"  : globalThis?.document?.createElement("html")
    //   case "head"  :
    //   case "style" :
    //   case "link"  :
    //   case "meta"  :
    //   case "srcipt":
    //   case "body"  : return null; break;
    //   default : return new UIElement(tag);
    // }
  }
});

export {
  tags
}