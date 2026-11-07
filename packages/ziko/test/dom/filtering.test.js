// test/dom/filtering.test.js

import { describe, it, expect, vi } from 'vitest';
import { tags } from 'ziko/dom';

const { div, span } = tags;

describe('Filtering', () => {
  const createItems = () => {
    const a = span('A');
    const b = span('B');
    const c = span('C');
    const parent = div(a, b, c);
    return { parent, a, b, c };
  };

  /* find */

  describe('find', () => {
    it('returns the first matching item', () => {
      const { parent, b } = createItems();

      expect(parent.find(item => item.element.textContent === 'B')).toBe(b);
    });

    it('returns undefined when no item matches', () => {
      const { parent } = createItems();

      expect(parent.find(item => item.element.textContent === 'X')).toBeUndefined();
    });

    it('passes item, index and collection to callback', () => {
      const { parent } = createItems();
      const callback = vi.fn(() => false);

      parent.find(callback);

      expect(callback).toHaveBeenCalledWith(parent[0], 0, parent.items);
      expect(callback).toHaveBeenCalledWith(parent[1], 1, parent.items);
      expect(callback).toHaveBeenCalledWith(parent[2], 2, parent.items);
    });

    it('stops after finding the first match', () => {
      const { parent } = createItems();
      const callback = vi.fn(item => item === parent[1]);

      parent.find(callback);

      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  /* filter */

  describe('filter', () => {
    it('returns all matching items', () => {
      const { parent, a, c } = createItems();

      expect(parent.filter(item => ['A', 'C'].includes(item.element.textContent))).toEqual([a, c]);
    });

    it('returns an empty array when no item matches', () => {
      const { parent } = createItems();

      expect(parent.filter(item => item.element.textContent === 'X')).toEqual([]);
    });

    it('returns all items when every item matches', () => {
      const { parent, a, b, c } = createItems();

      expect(parent.filter(() => true)).toEqual([a, b, c]);
    });

    it('passes item, index and collection to callback', () => {
      const { parent } = createItems();
      const callback = vi.fn(() => true);

      parent.filter(callback);

      expect(callback).toHaveBeenCalledWith(parent[0], 0, parent.items);
      expect(callback).toHaveBeenCalledWith(parent[1], 1, parent.items);
      expect(callback).toHaveBeenCalledWith(parent[2], 2, parent.items);
    });

    it('does not modify the original collection', () => {
      const { parent } = createItems();
      const originalItems = [...parent.items];

      parent.filter(item => item.element.textContent !== 'B');

      expect(parent.items).toEqual(originalItems);
    });

    it('returns a new array', () => {
      const { parent } = createItems();

      expect(parent.filter(() => true)).not.toBe(parent.items);
    });
  });
});