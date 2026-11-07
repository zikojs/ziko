// test/dom/traversal.test.js

import { describe, it, expect, vi } from 'vitest';
import { tags } from 'ziko/dom';

const { div, span } = tags;

describe('Traversal', () => {
  const createItems = () => {
    const a = span('A');
    const b = span('B');
    const c = span('C');
    const parent = div(a, b, c);
    return { parent, a, b, c };
  };

  /* forEach */

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

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenNthCalledWith(1, parent[0], 0, parent.items);
      expect(callback).toHaveBeenNthCalledWith(2, parent[1], 1, parent.items);
      expect(callback).toHaveBeenNthCalledWith(3, parent[2], 2, parent.items);
    });

    it('returns this for chaining', () => {
      const { parent } = createItems();

      expect(parent.forEach(() => {})).toBe(parent);
    });

    it('does not modify the collection', () => {
      const { parent } = createItems();
      const originalItems = [...parent.items];

      parent.forEach(() => {});

      expect(parent.items).toEqual(originalItems);
    });

    it('does not invoke the callback for an empty collection', () => {
      const parent = div();
      const callback = vi.fn();

      parent.forEach(callback);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  /* map */

  describe('map', () => {
    it('maps items into a new array', () => {
      const { parent } = createItems();

      expect(parent.map(item => item.element.textContent)).toEqual(['A', 'B', 'C']);
    });

    it('passes item, index and collection to callback', () => {
      const { parent } = createItems();
      const callback = vi.fn(item => item);

      parent.map(callback);

      expect(callback).toHaveBeenCalledTimes(3);
      expect(callback).toHaveBeenNthCalledWith(1, parent[0], 0, parent.items);
      expect(callback).toHaveBeenNthCalledWith(2, parent[1], 1, parent.items);
      expect(callback).toHaveBeenNthCalledWith(3, parent[2], 2, parent.items);
    });

    it('returns a new array without modifying the collection', () => {
      const { parent } = createItems();

      const result = parent.map(item => item.element.textContent);

      expect(result).not.toBe(parent.items);
      expect(parent.items).toHaveLength(3);
      expect(parent.map(item => item.element.textContent)).toEqual(['A', 'B', 'C']);
    });

    it('returns an empty array for an empty collection', () => {
      const parent = div();

      expect(parent.map(item => item)).toEqual([]);
    });

    it('supports transforming items into other values', () => {
      const { parent } = createItems();

      expect(parent.map((item, index) => `${index}:${item.element.textContent}`))
        .toEqual(['0:A', '1:B', '2:C']);
    });
  });
});