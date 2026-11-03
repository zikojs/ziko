import type { UIElement } from '../../../dom/UIElement/index.js';

export interface BoundingRectOptions {
    /** Abort observation when the signal is aborted. */
    signal?: AbortSignal;
}

export type BoundingRectCallback = (rect: DOMRect) => void;
export type Unsubscribe = () => void;

/**
 * Observes an element's bounding rectangle using ResizeObserver.
 *
 * @param target A DOM Element or ZikoJS UIElement.
 * @param callback Called immediately and whenever the element's size changes.
 * @param THROTTLE_DELAY Minimum delay between callback executions, in milliseconds. Defaults to 100.
 * @param options Observation options, including an optional AbortSignal.
 * @returns A function to stop observing the element.
 *
 * @example
 * ```ts
 * const unsubscribe = useBoundingRect(target, rect => {
 *     console.log(rect.width, rect.height, rect.top, rect.left);
 * });
 *
 * unsubscribe();
 * ```
 *
 * @example
 * ```ts
 * // Custom throttle delay
 * const unsubscribe = useBoundingRect(target, callback, 200);
 * ```
 *
 * @example
 * ```ts
 * // Abort observation
 * const controller = new AbortController();
 *
 * const unsubscribe = useBoundingRect(target, callback, 100, {
 *     signal: controller.signal
 * });
 *
 * controller.abort();
 * ```
 */
export declare function useBoundingRect(
    target: Element | UIElement,
    callback: BoundingRectCallback,
    THROTTLE_DELAY?: number,
    options?: BoundingRectOptions
): Unsubscribe;