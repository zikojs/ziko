import { describe, it, expect, beforeEach } from 'vitest';
import { tags } from 'ziko/dom';

const { div, span, p, h1, button } = tags;

/* Setup */
describe('UIStore querying', () => {
  let root, first, second, nested, heading, action;

  beforeEach(() => {
    first = span({ id: 'first', class: 'item active' }, 'First');
    second = p({ id: 'second', class: 'item' }, 'Second');

    heading = h1({ id: 'heading', class: 'title' }, 'Heading');
    action = button({ id: 'action', class: 'item' }, 'Action');

    nested = div(heading, action);
    root = div(first, second, nested);
  });

  /* getItemById */
  describe('getItemById', () => {
    it('returns the item with the specified ID', () => {
      expect(root.items.getItemById('first')).toBe(first);
      expect(root.items.getItemById('second')).toBe(second);
    });

    it('returns null when the ID does not exist', () => {
      expect(root.items.getItemById('missing')).toBeNull();
    });

    it('finds nested items', () => {
      expect(root.items.getItemById('action')).toBe(action);
      expect(root.items.getItemById('heading')).toBe(heading);
    });
  });

  /* getItemsByTagName */
  describe('getItemsByTagName', () => {
    it('returns items matching the tag name', () => {
      expect(root.items.getItemsByTagName('span')).toEqual([first]);
      expect(root.items.getItemsByTagName('div')).toEqual([nested]);
    });

    it('is case-insensitive', () => {
      expect(root.items.getItemsByTagName('SPAN')).toEqual([first]);
      expect(root.items.getItemsByTagName('H1')).toEqual([heading]);
    });

    it('returns all matching nested items', () => {
      expect(root.items.getItemsByTagName('button')).toEqual([action]);
    });

    it('returns an empty array when no item matches', () => {
      expect(root.items.getItemsByTagName('article')).toEqual([]);
    });
  });

  /* getItemsByClassName */
  describe('getItemsByClassName', () => {
    it('returns items containing the specified class', () => {
      expect(root.items.getItemsByClassName('item')).toEqual([
        first, second, action
      ]);
    });

    it('matches individual classes', () => {
      expect(root.items.getItemsByClassName('active')).toEqual([first]);
    });

    it('finds nested items', () => {
      expect(root.items.getItemsByClassName('title')).toEqual([heading]);
    });

    it('returns an empty array when no item matches', () => {
      expect(root.items.getItemsByClassName('missing')).toEqual([]);
    });
  });

  /* querySelector */
  describe('querySelector', () => {
    it('returns the first matching UIElement', () => {
      expect(root.items.querySelector('.item')).toBe(first);
    });

    it('supports ID selectors', () => {
      expect(root.items.querySelector('#second')).toBe(second);
    });

    it('supports tag selectors', () => {
      expect(root.items.querySelector('span')).toBe(first);
    });

    it('supports nested selectors', () => {
      expect(root.items.querySelector('#action')).toBe(action);
    });

    it('returns null when no item matches', () => {
      expect(root.items.querySelector('.missing')).toBeNull();
    });
  });

  /* querySelectorAll */
  describe('querySelectorAll', () => {
    it('returns all matching UIElements', () => {
      expect(root.items.querySelectorAll('.item')).toEqual([
        first, second, action
      ]);
    });

    it('supports ID selectors', () => {
      expect(root.items.querySelectorAll('#first')).toEqual([first]);
    });

    it('supports tag selectors', () => {
      expect(root.items.querySelectorAll('span')).toEqual([first]);
    });

    it('includes nested matching items', () => {
      expect(root.items.querySelectorAll('button')).toEqual([action]);
    });

    it('returns an empty array when no item matches', () => {
      expect(root.items.querySelectorAll('.missing')).toEqual([]);
    });
  });
});