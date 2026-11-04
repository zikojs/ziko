export interface ViewEventOptions {
    bubbles?: boolean;
    cancelable?: boolean;
}

export interface RegisterViewEventsOptions {
    /** Default intersection threshold for listeners. @default 0 */
    threshold?: number;
}

export interface AddViewEventListenerOptions extends AddEventListenerOptions {
    /** Override the default intersection threshold for this listener. */
    threshold?: number;
}

export type ViewEventType = 'enterview' | 'exitview';

export class ViewEvent extends CustomEvent<IntersectionObserverEntry> {
    constructor(
        type: ViewEventType,
        detail: IntersectionObserverEntry,
        options?: ViewEventOptions
    );
}

/**
 * Registers intersection-based custom events on an element.
 *
 * @param element - The target DOM element.
 * @param options - Registration options.
 * @returns A cleanup function that disconnects all observers.
 *
 * @example
 * ```js
 * const unregister = registerViewEvents(element);
 *
 * element.addEventListener('enterview', event => {
 *     console.log('Element entered view', event.detail);
 * });
 *
 * element.addEventListener('exitview', event => {
 *     console.log('Element exited view', event.detail);
 * });
 *
 * // Cleanup
 * unregister();
 * ```
 *
 * @example
 * // Set a default threshold
 * registerViewEvents(element, { threshold: 0.1 });
 *
 * // Uses the default threshold (0.1)
 * element.addEventListener('enterview', callback);
 *
 * // Overrides the default threshold
 * element.addEventListener('enterview', callback, {
 *     threshold: 0.5
 * });
 *
 * // Different thresholds can coexist
 * element.addEventListener('exitview', callback2, {
 *     threshold: 0.8
 * });
 */
export function registerViewEvents(
    element: Element,
    options?: RegisterViewEventsOptions
): () => void;