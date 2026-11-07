import { describe, it, expect } from 'vitest';
import { tags } from 'ziko/dom';
import { HTMLTags, SVGTags, MathMLTags } from '../../src/dom/tags/tags-list.js';

const HTML_NS = 'http://www.w3.org/1999/xhtml';
const SVG_NS = 'http://www.w3.org/2000/svg';
const MATHML_NS = 'http://www.w3.org/1998/Math/MathML';

/* HTML tags */
describe('HTML tags', () => {
  it('creates HTML elements by default', () => {
    expect(tags.div().element.namespaceURI).toBe(HTML_NS);
  });

  it('supports all registered HTML tags', () => {
    for (const tag of HTMLTags) {
      const ui = tags[tag]();
      expect(ui.element.namespaceURI, tag).toBe(HTML_NS);
      expect(ui.element.localName, tag).toBe(tag.toLowerCase());
    }
  });

  it('normalizes tag names', () => {
    expect(tags.DIV().element.localName).toBe('div');
    expect(tags.my_component().element.localName).toBe('my-component');
  });

  it('creates custom HTML elements', () => {
    const ui = tags['my-component']();
    expect(ui.element.localName).toBe('my-component');
    expect(ui.element.namespaceURI).toBe(HTML_NS);
  });
});

/* SVG tags */
describe('SVG tags', () => {
  it('creates SVG elements through the SVG namespace', () => {
    expect(tags.svg.svg().element.namespaceURI).toBe(SVG_NS);
    expect(tags.svg.circle().element.namespaceURI).toBe(SVG_NS);
  });

  it('supports all registered SVG tags', () => {
    for (const tag of SVGTags) {
      const ui = tags.svg[tag]();
      expect(ui.element.namespaceURI, tag).toBe(SVG_NS);
      expect(ui.element.localName, tag).toBe(tag);
    }
  });

  it('preserves camelCase SVG names', () => {
    expect(tags.svg.linearGradient().element.localName).toBe('linearGradient');
    expect(tags.svg.radialGradient().element.localName).toBe('radialGradient');
    expect(tags.svg.clipPath().element.localName).toBe('clipPath');
    expect(tags.svg.foreignObject().element.localName).toBe('foreignObject');
    expect(tags.svg.textPath().element.localName).toBe('textPath');
  });

  it('supports snake_case SVG aliases', () => {
    expect(tags.svg.linear_gradient().element.localName).toBe('linearGradient');
    expect(tags.svg.clip_path().element.localName).toBe('clipPath');
  });

  it('supports ambiguous tag names', () => {
    for (const tag of ['a', 'title', 'style', 'script']) {
      expect(tags.svg[tag]().element.namespaceURI).toBe(SVG_NS);
    }
  });

  it('creates custom SVG elements', () => {
    const ui = tags.svg.customShape();
    expect(ui.element.localName).toBe('customShape');
    expect(ui.element.namespaceURI).toBe(SVG_NS);
  });
});

/* MathML tags */
describe('MathML tags', () => {
  it('creates MathML elements through the MathML namespace', () => {
    expect(tags.mathml.math().element.namespaceURI).toBe(MATHML_NS);
  });

  it('supports all registered MathML tags', () => {
    for (const tag of MathMLTags) {
      const ui = tags.mathml[tag]();
      expect(ui.element.namespaceURI, tag).toBe(MATHML_NS);
      expect(ui.element.localName, tag).toBe(tag);
    }
  });

  it('normalizes MathML tag names', () => {
    expect(tags.mathml.MATH().element.localName).toBe('math');
    expect(tags.mathml.MFRAC().element.localName).toBe('mfrac');
  });

  it('creates custom MathML elements', () => {
    const ui = tags.mathml.customElement();
    expect(ui.element.localName).toBe('customelement');
    expect(ui.element.namespaceURI).toBe(MATHML_NS);
  });
});

/* Props */
describe('Tag props', () => {
  it('supports HTML attributes', () => {
    const ui = tags.div({ id: 'app', class: 'container' });
    expect(ui.element.id).toBe('app');
    expect(ui.element.className).toBe('container');
  });

  it('supports styles', () => {
    const ui = tags.div({ style: { color: 'red' } });
    expect(ui.element.style.color).toBe('red');
  });

  it('supports SVG attributes', () => {
    const ui = tags.svg.circle({ cx: 50, cy: 50, r: 20 });
    expect(ui.element.getAttribute('cx')).toBe('50');
    expect(ui.element.getAttribute('cy')).toBe('50');
    expect(ui.element.getAttribute('r')).toBe('20');
  });
});

/* Children */
describe('Tag children', () => {
  it('supports a single child', () => {
    const child = tags.span('Hello');
    const parent = tags.div(child);

    expect(parent.items).toContain(child);
    expect(parent.element.firstElementChild).toBe(child.element);
  });

  it('supports multiple children', () => {
    const parent = tags.div(
      tags.span('First'),
      tags.span('Second')
    );

    expect(parent.items).toHaveLength(2);
    expect(parent.element.children).toHaveLength(2);
  });

  it('supports props and children together', () => {
    const child = tags.span('Hello');
    const parent = tags.div({ id: 'app' }, child);

    expect(parent.element.id).toBe('app');
    expect(parent.items).toContain(child);
  });

  it('supports nested SVG elements', () => {
    const circle = tags.svg.circle({ r: 20 });
    const group = tags.svg.g(circle);
    const root = tags.svg.svg(group);

    expect(root.element.namespaceURI).toBe(SVG_NS);
    expect(group.element.namespaceURI).toBe(SVG_NS);
    expect(circle.element.namespaceURI).toBe(SVG_NS);
    expect(root.element.querySelector('circle')).toBe(circle.element);
  });

  it('supports nested MathML elements', () => {
    const numerator = tags.mathml.mn('1');
    const denominator = tags.mathml.mn('2');
    const fraction = tags.mathml.mfrac(numerator, denominator);

    expect(fraction.element.namespaceURI).toBe(MATHML_NS);
    expect(fraction.element.children).toHaveLength(2);
  });
});

/* Namespace isolation */
describe('Namespace isolation', () => {
  it('uses HTML at the root even for ambiguous names', () => {
    for (const tag of ['a', 'title', 'style', 'script']) {
      expect(tags[tag]().element.namespaceURI).toBe(HTML_NS);
    }
  });

  it('exposes SVG and MathML namespaces', () => {
    expect(tags.svg).toBeDefined();
    expect(tags.mathml).toBeDefined();
  });

  it('does not expose namespace proxies for symbols', () => {
    expect(tags[Symbol.iterator]).toBeUndefined();
    expect(tags.svg[Symbol.iterator]).toBeUndefined();
    expect(tags.mathml[Symbol.iterator]).toBeUndefined();
  });
});