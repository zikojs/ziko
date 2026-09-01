import { UIElement } from "../../constructors/UIElement.js";

/**
 * Options for configuring the UISwap component.
 */
export interface UISwapOptions {
  /**
   * The initial index of the item to display as active.
   * @default 0
   */
  activeIndex?: number;
}

/**
 * A logical sequence-based view control component that swaps visibility of child items.
 */
export class UISwap extends UIElement {
  /**
   * Internal reactive state object holding current component properties.
   */
  states: {
    activeIndex: number;
  };


  /**
   * Creates a new UISwap instance.
   * 
   * @param options Configuration options for the Swap component.
   * @param items Initial UI elements to add to the swap container.
   */
  constructor(options?: UISwapOptions, ...items: UIElement[]);

  /**
   * Gets the currently active UI item.
   */
  get currentActiveItem(): UIElement | undefined;

  /**
   * Advances forward by `n` items in the sequence.
   * 
   * @param n The number of steps to advance forward. Defaults to 1.
   * @returns The current `UISwap` instance for chaining.
   */
  next(n?: number): this;

  /**
   * Moves backward by `n` items in the sequence.
   * 
   * @param n The number of steps to retreat backward. Defaults to 1.
   * @returns The current `UISwap` instance for chaining.
   */
  previous(n?: number): this;

  /**
   * Activates and displays the child element at the target index.
   * 
   * @param index The target index to activate (supports negative modulo wrapping).
   * @returns The current `UISwap` instance for chaining.
   */
  activate(index: number): this;
}

/**
 * Factory function helper to create a `UISwap` component instance.
 * Supports optional properties object signature.
 * 
 * @example
 * ```ts
 * const swapper = Swap({ activeIndex: 0 }, itemA, itemB, itemC);
 * swapper.next();
 * ```
 */

export function Swap(
  options: { activeIndex?: number },
  ...items: UIElement[]
): UISwap;

export function Swap(...items: UIElement[]): UISwap;