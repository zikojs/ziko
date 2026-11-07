import { UIElement } from '../UIElement/index.js';
import { HTMLTags, SVGTags, MathMLTags } from './tags-list.js';
import { isUIItem } from '../utils/index.js';

const SVGTagMap = new Map(
  [...SVGTags].map(tag => [tag.toLowerCase(), tag])
);

export const tags = new Proxy({}, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined;
    const key = prop.replaceAll('_', '-').toLowerCase();
    let tag, type;
    if (HTMLTags.has(key)) {
      tag = key;
      type = 'html';
    } 
    else if (SVGTagMap.has(key)) {
      tag = SVGTagMap.get(key);
      type = 'svg';
    } 
    else if (MathMLTags.has(key)) {
      tag = key;
      type = 'mathml';
    } 
    else {
      tag = key;
    }
    return (...args) => {
      const ui = new UIElement({ element: tag, name: tag, type });
      if (!args.length) return ui;
      const first = args[0];
      if (isUIItem(first)) 
        return ui.append(...args);
      return new UIElement({ element: tag, name: tag, type, props: args.shift() })
        .append(...args);
    };
  }
});