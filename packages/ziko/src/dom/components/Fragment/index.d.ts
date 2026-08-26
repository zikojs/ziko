import { UIElement } from "../../constructors/UIElement.js";

/**
 * A zero-DOM container primitive that wraps child items using a DocumentFragment.
 */
export class UIFragment extends UIElement {
  /**
   * Creates a new UIFragment instance.
   * 
   * @param items Initial UI elements or primitives to group within the fragment.
   */
  constructor(...items: UIElement[]);

  /**
   * Identifies whether the element instance is a UIFragment.
   * 
   * @returns Always returns true.
   */
  isFragment(): true;
}

/**
 * Factory function to create a new `UIFragment` instance.
 * 
 * @param items Child elements or primitives to include in the fragment.
 * @returns A new UIFragment instance.
 * 
 * @example
 * ```ts
 * const group = Fragment(p("Item 1"), p("Item 2"));
 * if (group.isFragment()) {
 *   // Unpack or handle fragment logic
 * }
 * ```
 */
export function Fragment(...items: UIElement[]): UIFragment;