export const HTMLTags = new Set([
  // Document
  'html', 'head', 'body', 'title', 'base', 'link', 'meta', 'style',
  // Sectioning
  'address', 'article', 'aside', 'footer', 'header', 'h1', 'h2', 'h3',
  'h4', 'h5', 'h6', 'hgroup', 'main', 'nav', 'section', 'search',
  // Text content
  'blockquote', 'dd', 'div', 'dl', 'dt', 'figcaption', 'figure',
  'hr', 'li', 'menu', 'ol', 'p', 'pre', 'ul',
  // Inline text
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data',
  'dfn', 'em', 'i', 'kbd', 'mark', 'q', 'rp', 'rt', 'ruby',
  's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time',
  'u', 'var', 'wbr',
  // Media and embedded content
  'area', 'audio', 'canvas', 'embed', 'iframe', 'img', 'map',
  'object', 'picture', 'source', 'track', 'video',
  // Tables
  'caption', 'col', 'colgroup', 'table', 'tbody', 'td',
  'tfoot', 'th', 'thead', 'tr',
  // Forms
  'button', 'datalist', 'fieldset', 'form', 'input', 'label',
  'legend', 'meter', 'optgroup', 'option', 'output', 'progress',
  'select', 'selectedcontent', 'textarea',
  // Interactive
  'details', 'dialog', 'summary',
  // Scripting and templates
  'noscript', 'script', 'template', 'slot'
]);

export const SVGTags = new Set([
  // Structure
  'svg', 'g', 'defs', 'symbol', 'use', 'switch', 'view',
  // Shapes
  'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon', 'path',
  // Text
  'text', 'tspan', 'textPath',
  // Paint servers
  'linearGradient', 'radialGradient', 'stop', 'pattern',
  // Clipping and masking
  'clipPath', 'mask', 'marker',
  // Filters
  'filter',
  'feBlend', 'feColorMatrix', 'feComponentTransfer',
  'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDropShadow', 'feFlood',
  'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'feSpecularLighting',
  'feTile', 'feTurbulence',
  'feFuncA', 'feFuncR', 'feFuncG', 'feFuncB',
  // Animation
  'animate', 'animateMotion', 'animateTransform', 'set',
  'mpath',
  // Other
  'a', 'image', 'foreignObject', 'script', 'style',
  'desc', 'title', 'metadata'
]);

export const MathMLTags = new Set([
  'math','annotation','annotation-xml','semantics',
  // Token elements
  'mi', 'mn', 'mo', 'ms', 'mtext',
  // General layout
  'mrow', 'mstyle', 'merror', 'mpadded', 'mphantom',
  'mspace', 'menclose',
  // Fractions and roots
  'mfrac', 'msqrt', 'mroot',
  // Scripts
  'msub', 'msup', 'msubsup',
  'munder', 'mover', 'munderover',
  'mmultiscripts', 'mprescripts',
  // Tables
  'mtable', 'mtr', 'mtd',
  // Other
  'maction'
]);
