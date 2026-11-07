import type { UIElement } from '../UIElement/index.js';

/**
 * Props accepted by a tag factory.
 */
export type TagProps = Record<string, any>;

/**
 * Arguments accepted by a tag factory.
 *
 * @example
 * div()
 * div('Hello')
 * div({ id: 'app' })
 * div({ id: 'app' }, span('Hello'))
 * div(span('Hello'), span('World'))
 */
export type TagArgs = [props?: TagProps, ...children: any[]] | any[];

/**
 * Tag factory.
 */
export type TagFactory = (...args: TagArgs) => UIElement;

/**
 * HTML tag names.
 */
export type HTMLTagName =
  | 'html' | 'head' | 'body' | 'title' | 'base' | 'link' | 'meta' | 'style'
  | 'address' | 'article' | 'aside' | 'footer' | 'header' | 'main' | 'nav'
  | 'section' | 'search'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'hgroup'
  | 'blockquote' | 'dd' | 'div' | 'dl' | 'dt' | 'figcaption' | 'figure'
  | 'hr' | 'li' | 'menu' | 'ol' | 'p' | 'pre' | 'ul'
  | 'a' | 'abbr' | 'b' | 'bdi' | 'bdo' | 'br' | 'cite' | 'code'
  | 'data' | 'dfn' | 'em' | 'i' | 'kbd' | 'mark' | 'q' | 'rp' | 'rt'
  | 'ruby' | 's' | 'samp' | 'small' | 'span' | 'strong' | 'sub'
  | 'sup' | 'time' | 'u' | 'var' | 'wbr'
  | 'area' | 'audio' | 'img' | 'map' | 'track' | 'video' | 'embed'
  | 'iframe' | 'object' | 'picture' | 'source'
  | 'canvas' | 'noscript' | 'script'
  | 'del' | 'ins'
  | 'caption' | 'col' | 'colgroup' | 'table' | 'tbody' | 'td'
  | 'tfoot' | 'th' | 'thead' | 'tr'
  | 'button' | 'datalist' | 'fieldset' | 'form' | 'input' | 'label'
  | 'legend' | 'meter' | 'optgroup' | 'option' | 'output' | 'progress'
  | 'select' | 'textarea'
  | 'details' | 'dialog' | 'summary'
  | 'slot' | 'template';

/**
 * SVG tag names.
 */
export type SVGTagName =
  | 'svg' | 'g' | 'defs' | 'symbol' | 'use' | 'switch' | 'view'
  | 'rect' | 'circle' | 'ellipse' | 'line' | 'polyline' | 'polygon'
  | 'path' | 'text' | 'tspan' | 'textPath'
  | 'linearGradient' | 'radialGradient' | 'stop'
  | 'pattern' | 'clipPath' | 'mask' | 'marker'
  | 'filter' | 'feBlend' | 'feColorMatrix' | 'feComponentTransfer'
  | 'feComposite' | 'feConvolveMatrix' | 'feDiffuseLighting'
  | 'feDisplacementMap' | 'feDistantLight' | 'feDropShadow'
  | 'feFlood' | 'feFuncA' | 'feFuncB' | 'feFuncG' | 'feFuncR'
  | 'feGaussianBlur' | 'feImage' | 'feMerge' | 'feMergeNode'
  | 'feMorphology' | 'feOffset' | 'fePointLight' | 'feSpecularLighting'
  | 'feSpotLight' | 'feTile' | 'feTurbulence'
  | 'animate' | 'animateMotion' | 'animateTransform' | 'set'
  | 'a' | 'image' | 'foreignObject' | 'script' | 'style'
  | 'desc' | 'title' | 'metadata';

/**
 * MathML tag names.
 */
export type MathMLTagName =
  | 'math' | 'annotation' | 'annotation-xml' | 'semantics'
  | 'mi' | 'mn' | 'mo' | 'ms' | 'mtext' | 'mrow' | 'mstyle'
  | 'merror' | 'mpadded' | 'mphantom' | 'mspace' | 'menclose'
  | 'mfrac' | 'msqrt' | 'mroot'
  | 'msub' | 'msup' | 'msubsup'
  | 'munder' | 'mover' | 'munderover' | 'mmultiscripts' | 'mprescripts'
  | 'mtable' | 'mtr' | 'mtd' | 'maction';

/**
 * HTML tag factories.
 */
export type HTMLTags = Record<HTMLTagName, TagFactory>;

/**
 * SVG tag factories.
 */
export type SVGTags = Record<SVGTagName, TagFactory>;

/**
 * MathML tag factories.
 */
export type MathMLTags = Record<MathMLTagName, TagFactory>;

/**
 * Main tags API.
 *
 * HTML is the default namespace.
 *
 * @example
 * import { tags } from 'ziko/dom';
 *
 * const app = tags.div(
 *   { id: 'app' },
 *   tags.span('Hello')
 * );
 *
 * @example
 * const icon = tags.svg.svg(
 *   { viewBox: '0 0 24 24' },
 *   tags.svg.circle({ cx: 12, cy: 12, r: 10 })
 * );
 *
 * @example
 * const formula = tags.mathml.math(
 *   tags.mathml.mfrac(
 *     tags.mathml.mn('1'),
 *     tags.mathml.mn('2')
 *   )
 * );
 */
export declare const tags: HTMLTags & {
  svg: SVGTags;
  mathml: MathMLTags;
};