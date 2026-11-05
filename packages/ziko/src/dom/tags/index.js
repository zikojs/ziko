import { UIElement } from '../UIElement/index.js';
import { HTMLTags, SVGTags, MathMLTags } from './tags-list.js';
import { isStateGetter } from '../../hooks/state/use-state/index.js';

const SVGTagMap = new Map(
  [...SVGTags].map(tag => [tag.toLowerCase(), tag])
);

const isHTMLElement = value =>
  typeof globalThis.HTMLElement === 'function' &&
  value instanceof globalThis.HTMLElement;

export const tags = new Proxy({}, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined;

    const key = prop.replaceAll('_', '-').toLowerCase();

    let tag, type;

    if (HTMLTags.has(key)) {
      tag = key;
      type = 'html';
    } else if (SVGTagMap.has(key)) {
      tag = SVGTagMap.get(key);
      type = 'svg';
    } else if (MathMLTags.has(key)) {
      tag = key;
      type = 'mathml';
    } else {
      tag = key;
    }

    return (...args) => {
      const ui = new UIElement({ element: tag, name: tag, type });

      if (!args.length) return ui;

      const first = args[0];

      if (
        ['string', 'number'].includes(typeof first) ||
        first instanceof UIElement ||
        isStateGetter(first) ||
        isHTMLElement(first) ||
        first instanceof Promise
      ) {
        return ui.append(...args);
      }

      return new UIElement({ element: tag, name: tag, type, props: args.shift() })
        .append(...args);
    };
  }
});