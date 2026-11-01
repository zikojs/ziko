import type { UIElement } from '../../../dom/UIElement/index.js';

/**
 * Detects long-press interactions on a DOM element or ZikoJS UIElement.
 *
 * Attaches Pointer Event listeners and invokes the callback
 * when the target is pressed for the specified duration.
 *
 * @param target - Target DOM element or ZikoJS UIElement.
 * @param callback - Function called when the long-press duration is reached.
 * @param timeout - Press duration in milliseconds. Defaults to 500.
 * @returns A cleanup function that cancels the timer and resets the press state.
 *
 * @example
 * ```ts
 * const button = document.querySelector('button')!;
 *
 * const cleanup = useLongPress(button, event => {
 *     console.log('Long pressed!', event);
 * }, 1000);
 *
 * cleanup();
 * ```
 *
 * @example
 * ```ts
 * const button = tags.button('Hold me');
 *
 * useLongPress(button, () => {
 *     console.log('Long pressed!');
 * });
 * ```
 */
export declare function useLongPress(
    target: Element | UIElement,
    callback: (event: PointerEvent) => void,
    timeout?: number
): () => void;