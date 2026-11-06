import { describe, it, expect, beforeEach, vi } from 'vitest';
import { tags } from 'ziko/dom';

describe('UIElement indexing methods', () => {
  let parent;
  let a, b, c;

  beforeEach(() => {
    parent = tags.div();
    a = tags.span('A');
    b = tags.span('B');
    c = tags.span('C');
    parent.append(a, b, c);
  });

  /* at */

  it('returns an element at the specified index', () => {
    expect(parent.at(0)).toBe(a);
    expect(parent.at(1)).toBe(b);
    expect(parent.at(2)).toBe(c);
  });

  it('supports negative indexes', () => {
    expect(parent.at(-1)).toBe(c);
    expect(parent.at(-2)).toBe(b);
    expect(parent.at(-3)).toBe(a);
  });

  it('returns undefined for out-of-range indexes', () => {
    expect(parent.at(3)).toBeUndefined();
    expect(parent.at(-4)).toBeUndefined();
  });

  /* forEach */

  it('iterates over all elements in order', () => {
    const callback = vi.fn();

    const result = parent.forEach(callback);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback.mock.calls.map(([item]) => item)).toEqual([a, b, c]);
    expect(result).toBe(parent);
  });

  it('provides index and items arguments', () => {
    const callback = vi.fn();

    parent.forEach(callback);

    expect(callback).toHaveBeenNthCalledWith(1, a, 0, parent.items);
    expect(callback).toHaveBeenNthCalledWith(2, b, 1, parent.items);
    expect(callback).toHaveBeenNthCalledWith(3, c, 2, parent.items);
  });

  /* map */

  it('maps elements to a new array', () => {
    const result = parent.map(item => item.element.textContent);

    expect(result).toEqual(['A', 'B', 'C']);
    expect(result).not.toBe(parent.items);
  });

  it('provides index and items arguments', () => {
    const callback = vi.fn((item, index) => index);

    expect(parent.map(callback)).toEqual([0, 1, 2]);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  /* find */

  it('returns all elements matching the condition', () => {
    const result = parent.find(item => item.element.textContent !== 'B');

    expect(result).toEqual([a, c]);
  });

  it('returns an empty array when no elements match', () => {
    expect(parent.find(item => item.element.textContent === 'D')).toEqual([]);
  });

  it('provides index and items arguments', () => {
    const callback = vi.fn(() => true);

    parent.find(callback);

    expect(callback).toHaveBeenNthCalledWith(1, a, 0, parent.items);
    expect(callback).toHaveBeenNthCalledWith(2, b, 1, parent.items);
    expect(callback).toHaveBeenNthCalledWith(3, c, 2, parent.items);
  });
});