/**
 * Custom resize event dispatched when an observed element changes size.
 *
 * @example
 * element.addEventListener('resize', (event: ResizeEvent<{ width: number; height: number; entry: ResizeObserverEntry }>) => {
 *     console.log(event.detail.width);
 *     console.log(event.detail.height);
 *     console.log(event.detail.entry);
 * });
 */
export class ResizeEvent<T = unknown> extends CustomEvent<T> {
    constructor(
        type: string,
        detail: T,
        options?: {
            bubbles?: boolean;
            cancelable?: boolean;
        }
    );
}

/**
 * Registers a resize observer on an element.
 *
 * Dispatches a `ResizeEvent` whenever the element's content size changes.
 *
 * @param element - The element to observe.
 * @returns A cleanup function that unregisters the observer.
 *
 * @example
 * const destroy = registerResizeEvent(element);
 *
 * element.addEventListener('resize', event => {
 *     const { width, height } = event.detail;
 *     console.log(`New size: ${width} × ${height}`);
 * });
 *
 * // Stop observing
 * destroy();
 */
export function registerResizeEvent(element: Element): () => void;