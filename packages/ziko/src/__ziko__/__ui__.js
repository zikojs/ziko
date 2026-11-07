export class UIStore extends Array {
  constructor(...args) {
    super(...args);
  }

  static get [Symbol.species]() {
    return Array;
  }

  *[Symbol.iteratorRecursive]() {
    for (const item of this) {
      yield item;
      if (item.items) yield* item.items[Symbol.iteratorRecursive]();
    }
  }

  getItemById(id) {
    for (const item of this[Symbol.iteratorRecursive]()) {
      if (item.element?.id === id) return item;
    }
    return null;
  }

  getItemsByTagName(tag) {
    tag = tag.toLowerCase();
    return [...this[Symbol.iteratorRecursive]()].filter(
      item => item.element?.tagName?.toLowerCase() === tag
    );
  }

  getItemsByClassName(className) {
    return [...this[Symbol.iteratorRecursive]()].filter(
      item => item.element?.classList?.contains(className)
    );
  }

  querySelector(selector) {
    for (const item of this[Symbol.iteratorRecursive]()) {
      if (item.element?.matches?.(selector)) return item;
    }
    return null;
  }

  querySelectorAll(selector) {
    return [...this[Symbol.iteratorRecursive]()].filter(
      item => item.element?.matches?.(selector)
    );
  }
}

// create the singleton
export const __UI__ = new UIStore();
