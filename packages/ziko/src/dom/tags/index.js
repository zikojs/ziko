import { UIElement } from '../UIElement/index.js';
import { isUIItem } from '../utils/index.js';

const SVG_TAGS = new Set([
  'svg', 'g', 'defs', 'desc', 'title', 'metadata',
  'symbol', 'use', 'switch',
  'path', 'rect', 'circle', 'ellipse', 'line',
  'polyline', 'polygon',
  'text', 'tspan', 'textPath',
  'marker', 'pattern', 'mask', 'clipPath',
  'linearGradient', 'radialGradient', 'stop',
  'filter', 'feBlend', 'feColorMatrix', 'feComponentTransfer',
  'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feDropShadow',
  'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
  'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting',
  'feSpotLight', 'feTile', 'feTurbulence',
  'foreignObject', 'image', 'view',
  'animate', 'animateMotion', 'animateTransform', 'set',
  'color-profile', 'cursor', 'discard',
  'hatch', 'hatchpath', 'mesh', 'meshgradient',
  'meshpatch', 'meshrow', 'solidcolor'
]);

const MATHML_TAGS = new Set([
  'math', 'mi', 'mn', 'mo', 'ms', 'mtext',
  'mrow', 'mfrac', 'msqrt', 'mroot',
  'msub', 'msup', 'msubsup',
  'munder', 'mover', 'munderover',
  'mmultiscripts', 'mprescripts', 'none',
  'mtable', 'mtr', 'mtd',
  'maligngroup', 'malignmark',
  'menclose', 'merror', 'mfenced',
  'mpadded', 'mphantom',
  'mstyle', 'mspace',
  'semantics', 'annotation', 'annotation-xml',
  'maction',
  'mlabeledtr', 'mstack', 'mlongdiv',
  'msgroup', 'msline', 'msrow',
  'mscarries', 'mscarry',
  'mglyph', 'mglyph'
]);

function normalizeTag(tag, type) {
  if (type === 'svg') {
    return tag.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
  }

  return tag.replaceAll('_', '-').toLowerCase();
}

function resolveNamespace(tag) {
  const svgTag = normalizeTag(tag, 'svg');

  if (SVG_TAGS.has(svgTag)) return 'svg';
  if (MATHML_TAGS.has(tag.toLowerCase())) return 'mathml';

  return 'html';
}

function createTag(tag, args) {
  const type = resolveNamespace(tag);
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
export const tags = new Proxy(Object.create(null), {
  get(_, prop) {
    if (typeof prop !== 'string') return undefined;

    return (...args) => createTag(prop, args);
  }
});