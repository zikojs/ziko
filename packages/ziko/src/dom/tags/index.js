import {UIElement} from '../UIElement/index.js';
import { HTMLTags, SVGTags, MathMLTags } from './tags-list.js';
import { isStateGetter } from '../../hooks/state/use-state/index.js';

export const tags = new Proxy({}, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined;
    let tag = prop.replaceAll('_','-').toLowerCase();
    let type ;
    if(HTMLTags.includes(tag)) type = 'html';
    if(SVGTags.includes(tag)) type = 'svg';
    if(MathMLTags.includes(tag)) type = 'mathml';
    return (...args) => {
      const ui = new UIElement({element : tag, name : tag, type});
      const first = args[0]
      if(args.length === 0) return ui
      if(
        ['string', 'number'].includes(typeof first) 
        || first instanceof UIElement 
        || isStateGetter(first)
        || first instanceof HTMLElement
        || first instanceof Promise  // To be Fixed with isItem 
      ) return ui.append(...args);
      return new UIElement({element : tag, type, props : args.shift()}).append(...args)
    }
  }
});