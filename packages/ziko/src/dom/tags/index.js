import {UIElement} from "../UIElement/index.js";
import { HTMLTags, SVGTags, MathMLTags } from "./tags-list.js";
import { isStateGetter } from "../../hooks/use-state.js";
import { call_with_optional_props } from "../internal-utils/call_with_optional_props.js";
import { is_ui_item } from "../internal-utils/is_ui_item.js";

export const tags = new Proxy({}, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined;
    let tag = prop.replaceAll("_","-").toLowerCase();
    let type ;
    if(HTMLTags.includes(tag)) type = 'html';
    if(SVGTags.includes(tag)) type = 'svg';
    if(MathMLTags.includes(tag)) type = 'mathml';
    return (...args) => {
      if(args.length === 0) {
        return new UIElement({element : tag, name : tag, type})
      }
      if(
        ['string', 'number'].includes(typeof args[0]) 
        || args[0] instanceof UIElement 
        || isStateGetter(args[0])
        || args[0] instanceof HTMLElement
      ) return new UIElement({element : tag, name : tag, type}).append(...args);
      return new UIElement({element : tag, type, props : args.shift()}).append(...args)
    }
  }
});