// test/dom/indexing.test.js

import { describe, it, expect } from 'vitest';
import { tags } from 'ziko/dom';

const { div, span, p} = tags

describe('Indexing', () => {
  const createItems = () => {
    const a = span('A');
    const b = span('B');
    const c = span('C');
    const parent = div(a, b, c);
    return { parent, a, b, c };
  };

  /* at */

  describe('at', () => {
    it('returns the item at the specified index', () => {
      const { parent, a, b, c } = createItems();

      expect(parent.at(0)).toBe(a);
      expect(parent.at(1)).toBe(b);
      expect(parent.at(2)).toBe(c);
    });

    it('supports negative indexes', () => {
      const { parent, a, c } = createItems();

      expect(parent.at(-1)).toBe(c);
      expect(parent.at(-3)).toBe(a);
    });

    it('returns undefined for out-of-range indexes', () => {
      const { parent } = createItems();

      expect(parent.at(3)).toBeUndefined();
      expect(parent.at(-4)).toBeUndefined();
    });
  });

  /* Numeric access */

  describe('numeric access', () => {
    it('allows accessing items through numeric properties', () => {
      const { parent, a, b, c } = createItems();

      expect(parent[0]).toBe(a);
      expect(parent[1]).toBe(b);
      expect(parent[2]).toBe(c);
    });

    it('defines numeric properties as non-enumerable', () => {
      const { parent } = createItems();

      expect(Object.keys(parent)).not.toContain('0');
      expect(Object.getOwnPropertyDescriptor(parent, '0').enumerable).toBe(false);
    });

    it('updates numeric properties after insertion', () => {
      const { parent, a, b, c } = createItems();
      const x = span('X');

      parent.prepend(x);

      expect(parent[0]).toBe(x);
      expect(parent[1]).toBe(a);
      expect(parent[2]).toBe(b);
      expect(parent[3]).toBe(c);
    });

    it('updates numeric properties after removal', () => {
      const { parent, a, b, c } = createItems();

      parent.remove(1);

      expect(parent[0]).toBe(a);
      expect(parent[1]).toBe(c);
      expect(parent[2]).toBeUndefined();
    });
  });

  /* Filtering */

  describe('find', () => {
    it('returns the first matching item', () => {
      const { parent, b } = createItems();

      expect(parent.find(item => item.element.textContent === 'B')).toBe(b);
    });

    it('returns undefined when no item matches', () => {
      const { parent } = createItems();

      expect(parent.find(item => item.element.textContent === 'X')).toBeUndefined();
    });
  });

  describe('filter', () => {
    it('returns all matching items', () => {
      const { parent, a, c } = createItems();

      expect(parent.filter(item => ['A', 'C'].includes(item.element.textContent))).toEqual([a, c]);
    });

    it('returns an empty array when no item matches', () => {
      const { parent } = createItems();

      expect(parent.filter(item => item.element.textContent === 'X')).toEqual([]);
    });
  });

  /* Traversal */

  describe('forEach', () => {
    it('iterates over all items in order', () => {
      const { parent } = createItems();
      const result = [];

      parent.forEach(item => result.push(item.element.textContent));

      expect(result).toEqual(['A', 'B', 'C']);
    });

    it('passes item, index and collection to callback', () => {
      const { parent } = createItems();
      const callback = vi.fn();

      parent.forEach(callback);

      expect(callback).toHaveBeenCalledWith(parent[0], 0, parent.items);
      expect(callback).toHaveBeenCalledWith(parent[1], 1, parent.items);
      expect(callback).toHaveBeenCalledWith(parent[2], 2, parent.items);
    });

    it('returns this for chaining', () => {
      const { parent } = createItems();

      expect(parent.forEach(() => {})).toBe(parent);
    });
  });

  describe('map', () => {
    it('maps items into a new array', () => {
      const { parent } = createItems();

      expect(parent.map(item => item.element.textContent)).toEqual(['A', 'B', 'C']);
    });

    it('passes item, index and collection to callback', () => {
      const { parent } = createItems();
      const callback = vi.fn(item => item);

      parent.map(callback);

      expect(callback).toHaveBeenCalledWith(parent[0], 0, parent.items);
      expect(callback).toHaveBeenCalledWith(parent[1], 1, parent.items);
      expect(callback).toHaveBeenCalledWith(parent[2], 2, parent.items);
    });

    it('returns a new array without modifying the collection', () => {
      const { parent } = createItems();
      const result = parent.map(item => item.element.textContent);

      expect(result).not.toBe(parent.items);
      expect(parent.items).toHaveLength(3);
    });
  });
});