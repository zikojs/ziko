import { UIElement } from '../UIElement/index.js';
import { isUIItem } from '../utils/index.js';

function normalizeTag(tag, type) {
  if (type === 'svg') {
    // linear_gradient -> linearGradient
    return tag.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
  }

  return tag.replaceAll('_', '-').toLowerCase();
}

function createTag(tag, type, args) {
  tag = normalizeTag(tag, type);

  const first = args[0];
  const props = args.length && !isUIItem(first) ? args.shift() : undefined;

  const ui = new UIElement({
    element: tag,
    name: tag,
    type,
    props
  });

  if (args.length) ui.append(...args);

  return ui;
}

function createNamespace(type) {
  return new Proxy(Object.create(null), {
    get(_, prop) {
      if (typeof prop !== 'string') return undefined;

      return (...args) => createTag(prop, type, args);
    }
  });
}

const svg = createNamespace('svg');
const mathml = createNamespace('mathml');
const html = createNamespace('html');

export const tags = new Proxy(html, {
  get(target, prop) {
    if (prop === 'svg') return svg;
    if (prop === 'mathml') return mathml;

    return Reflect.get(target, prop);
  }
});