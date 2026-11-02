export type DocumentVisibilityCallback = (isVisible: boolean) => void;

export type DocumentVisibilityListener = (
    callback: DocumentVisibilityCallback
) => void;

export type DocumentVisibilityUnsubscribe = () => void;

export type UseDocumentVisibilityResult = [
    watchDV: DocumentVisibilityListener,
    unsubscribe: DocumentVisibilityUnsubscribe
];

/**
 * Observes document visibility changes.
 *
 * Registers callbacks that receive the current visibility state immediately,
 * then receive updates whenever the document visibility changes.
 *
 * @returns A tuple containing the listener registration function
 * and the unsubscribe function.
 *
 * @example
 * ```js
 * const [watchDV, unsubscribe] = useDocumentVisibility();
 *
 * watchDV((isVisible) => {
 *     console.log(isVisible ? "Tab visible" : "Tab hidden");
 * });
 * ```
 *
 * @example
 * ```js
 * const [watchDV, unsubscribe] = useDocumentVisibility();
 *
 * const callback = (isVisible) => {
 *     console.log(isVisible);
 * };
 *
 * watchDV(callback);
 *
 * // Removes all listeners and stops observing visibility changes.
 * unsubscribe();
 * ```
 */
export declare function useDocumentVisibility(): UseDocumentVisibilityResult;