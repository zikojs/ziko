import { describe, it, expect } from 'vitest';
import { tags } from 'ziko/dom';

const HTML_NS = 'http://www.w3.org/1999/xhtml';
const SVG_NS = 'http://www.w3.org/2000/svg';
const MATHML_NS = 'http://www.w3.org/1998/Math/MathML';

/* HTML tags */
describe('HTML tags', () => {
  it('creates HTML elements by default', () => {
    expect(tags.div().element.namespaceURI).toBe(HTML_NS);
    expect(tags.p().element.namespaceURI).toBe(HTML_NS);
    expect(tags.span().element.namespaceURI).toBe(HTML_NS);
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
  it('creates SVG elements', () => {
    expect(tags.svg().element.namespaceURI).toBe(SVG_NS);
    expect(tags.circle().element.namespaceURI).toBe(SVG_NS);
    expect(tags.g().element.namespaceURI).toBe(SVG_NS);
  });

  it('preserves camelCase SVG names', () => {
    expect(tags.linearGradient().element.localName).toBe('linearGradient');
    expect(tags.radialGradient().element.localName).toBe('radialGradient');
    expect(tags.clipPath().element.localName).toBe('clipPath');
    expect(tags.foreignObject().element.localName).toBe('foreignObject');
    expect(tags.textPath().element.localName).toBe('textPath');
  });

  it('supports snake_case SVG aliases', () => {
    expect(tags.linear_gradient().element.localName).toBe('linearGradient');
    expect(tags.clip_path().element.localName).toBe('clipPath');
  });

  it('creates nested SVG elements', () => {
    const circle = tags.circle({ r: 20 });
    const group = tags.g(circle);
    const root = tags.svg(group);

    expect(root.element.namespaceURI).toBe(SVG_NS);
    expect(group.element.namespaceURI).toBe(SVG_NS);
    expect(circle.element.namespaceURI).toBe(SVG_NS);
    expect(root.element.querySelector('circle')).toBe(circle.element);
  });
});

/* MathML tags */
describe('MathML tags', () => {
  it('creates MathML elements', () => {
    expect(tags.math().element.namespaceURI).toBe(MATHML_NS);
    expect(tags.mfrac().element.namespaceURI).toBe(MATHML_NS);
    expect(tags.mi().element.namespaceURI).toBe(MATHML_NS);
  });

  it('normalizes MathML tag names', () => {
    expect(tags.MATH().element.localName).toBe('math');
    expect(tags.MFRAC().element.localName).toBe('mfrac');
  });

  it('creates nested MathML elements', () => {
    const numerator = tags.mn('1');
    const denominator = tags.mn('2');
    const fraction = tags.mfrac(numerator, denominator);
    const root = tags.math(fraction);

    expect(root.element.namespaceURI).toBe(MATHML_NS);
    expect(fraction.element.namespaceURI).toBe(MATHML_NS);
    expect(fraction.element.children).toHaveLength(2);
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
    const ui = tags.circle({ cx: 50, cy: 50, r: 20 });

    expect(ui.element.getAttribute('cx')).toBe('50');
    expect(ui.element.getAttribute('cy')).toBe('50');
    expect(ui.element.getAttribute('r')).toBe('20');
  });

  it('supports MathML attributes', () => {
    const ui = tags.math({ display: 'block' });
    expect(ui.element.getAttribute('display')).toBe('block');
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
});

/* Namespace resolution */
describe('Namespace resolution', () => {
  it('uses HTML for standard HTML tags', () => {
    for (const tag of ['div', 'section', 'article', 'button', 'input']) {
      expect(tags[tag]().element.namespaceURI).toBe(HTML_NS);
    }
  });

  it('uses SVG for standard SVG tags', () => {
    for (const tag of ['svg', 'circle', 'rect', 'path', 'g', 'defs']) {
      expect(tags[tag]().element.namespaceURI).toBe(SVG_NS);
    }
  });

  it('uses MathML for standard MathML tags', () => {
    for (const tag of ['math', 'mi', 'mn', 'mo', 'mfrac', 'msqrt']) {
      expect(tags[tag]().element.namespaceURI).toBe(MATHML_NS);
    }
  });

  it('defaults unknown tags to HTML', () => {
    const ui = tags.custom_element();

    expect(ui.element.localName).toBe('custom-element');
    expect(ui.element.namespaceURI).toBe(HTML_NS);
  });

  it('does not expose namespace proxies', () => {
    expect(typeof tags.svg).toBe('function');
    expect(typeof tags.math).toBe('function');
    expect(tags[Symbol.iterator]).toBeUndefined();
  });
});

/* Promise children */
describe('Promise children', () => {
  it('supports promise children', async () => {
    const promise = Promise.resolve('Hello');
    const parent = tags.div(promise);

    await promise;

    expect(parent.element.textContent).toContain('Hello');
  });
});