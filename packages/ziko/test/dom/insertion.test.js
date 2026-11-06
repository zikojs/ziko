import { describe, it, expect, beforeEach } from 'vitest';
import { tags } from 'ziko/dom/tags';

describe('UIElement DOM insertion methods', () => {
  let parent;
  let a, b, c, d;

  beforeEach(() => {
    parent = tags.div();
    a = tags.span('A');
    b = tags.span('B');
    c = tags.span('C');
    d = tags.span('D');
  });

  const getText = () => parent.element.textContent;

  /* append */

  it('appends elements in order', () => {
    parent.append(a, b, c);

    expect(getText()).toBe('ABC');
    expect(parent.items).toEqual([a, b, c]);
  });

  it('appends elements after existing children', () => {
    parent.append(a, b);
    parent.append(c, d);

    expect(getText()).toBe('ABCD');
    expect(parent.items).toEqual([a, b, c, d]);
  });

  /* prepend */

  it('prepends elements in the correct order', () => {
    parent.append(c, d);
    parent.prepend(a, b);

    expect(getText()).toBe('ABCD');
    expect(parent.items).toEqual([a, b, c, d]);
  });

  it('prepends elements to an empty parent', () => {
    parent.prepend(a, b);

    expect(getText()).toBe('AB');
    expect(parent.items).toEqual([a, b]);
  });

  /* insertAt */

  it('inserts at the beginning', () => {
    parent.append(b, c);
    parent.insertAt(0, a);

    expect(getText()).toBe('ABC');
    expect(parent.items).toEqual([a, b, c]);
  });

  it('inserts at a specific index', () => {
    parent.append(a, c);
    parent.insertAt(1, b);

    expect(getText()).toBe('ABC');
    expect(parent.items).toEqual([a, b, c]);
  });

  it('inserts at the end', () => {
    parent.append(a, b);
    parent.insertAt(2, c);

    expect(getText()).toBe('ABC');
    expect(parent.items).toEqual([a, b, c]);
  });

  it('supports negative indexes', () => {
    parent.append(a, b, c);
    parent.insertAt(-1, d);

    expect(getText()).toBe('ABCD');
    expect(parent.items).toEqual([a, b, c, d]);
  });

  it('inserts before the last element with -2', () => {
    parent.append(a, b, c);
    parent.insertAt(-2, d);

    expect(getText()).toBe('ABDC');
    expect(parent.items).toEqual([a, b, d, c]);
  });

  it('clamps indexes outside the valid range', () => {
    parent.append(a, b);
    parent.insertAt(-100, c);
    parent.insertAt(100, d);

    expect(getText()).toBe('CABD');
    expect(parent.items).toEqual([c, a, b, d]);
  });

  it('inserts multiple elements in the correct order', () => {
    parent.append(a, d);
    parent.insertAt(1, b, c);

    expect(getText()).toBe('ABCD');
    expect(parent.items).toEqual([a, b, c, d]);
  });

  /* insertBefore */

  it('inserts before a reference element', () => {
    parent.append(a, c);
    parent.insertBefore(c, b);

    expect(getText()).toBe('ABC');
    expect(parent.items).toEqual([a, b, c]);
  });

  it('inserts multiple elements before a reference', () => {
    parent.append(a, d);
    parent.insertBefore(d, b, c);

    expect(getText()).toBe('ABCD');
    expect(parent.items).toEqual([a, b, c, d]);
  });

  it('does nothing when the reference is not a child', () => {
    parent.append(a, b);
    parent.insertBefore(c, d);

    expect(getText()).toBe('AB');
    expect(parent.items).toEqual([a, b]);
  });

  /* insertAfter */

  it('inserts after a reference element', () => {
    parent.append(a, c);
    parent.insertAfter(a, b);

    expect(getText()).toBe('ABC');
    expect(parent.items).toEqual([a, b, c]);
  });

  it('inserts multiple elements after a reference', () => {
    parent.append(a, d);
    parent.insertAfter(a, b, c);

    expect(getText()).toBe('ABCD');
    expect(parent.items).toEqual([a, b, c, d]);
  });

  it('does nothing when the reference is not a child', () => {
    parent.append(a, b);
    parent.insertAfter(c, d);

    expect(getText()).toBe('AB');
    expect(parent.items).toEqual([a, b]);
  });

    /* remove */

  it('removes an element', () => {
    parent.append(a, b, c);
    parent.remove(b);

    expect(getText()).toBe('AC');
    expect(parent.items).toEqual([a, c]);
  });

  it('removes multiple elements', () => {
    parent.append(a, b, c, d);
    parent.remove(b, d);

    expect(getText()).toBe('AC');
    expect(parent.items).toEqual([a, c]);
  });

  it('removes an element by index', () => {
    parent.append(a, b, c);
    parent.remove(1);

    expect(getText()).toBe('AC');
    expect(parent.items).toEqual([a, c]);
  });

  it('removes multiple elements by index', () => {
    parent.append(a, b, c, d);
    parent.remove(0, 2);

    expect(getText()).toBe('BD');
    expect(parent.items).toEqual([b, d]);
  });

  it('does nothing when the element is not a child', () => {
    parent.append(a, b);
    parent.remove(c);

    expect(getText()).toBe('AB');
    expect(parent.items).toEqual([a, b]);
  });

  it('does nothing when the index is out of range', () => {
    parent.append(a, b);
    parent.remove(10);

    expect(getText()).toBe('AB');
    expect(parent.items).toEqual([a, b]);
  });

  it('does not throw when removing the same element twice', () => {
    parent.append(a, b);
    parent.remove(a, a);

    expect(getText()).toBe('B');
    expect(parent.items).toEqual([b]);
  });

  it('can append an element again after removing it', () => {
    parent.append(a, b);
    parent.remove(a);
    parent.append(a);

    expect(getText()).toBe('BA');
    expect(parent.items).toEqual([b, a]);
  });
});