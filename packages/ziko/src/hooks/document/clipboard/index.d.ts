export type ClipboardChangeCallback = (text: string) => void;

export type ClipboardChangeListener = (
    callback: ClipboardChangeCallback
) => void;

export type ClipboardCopy = (value: string) => Promise<true>;

export type ClipboardUnsubscribe = () => void;

export type UseClipboardResult = [
    copy: ClipboardCopy,
    watch: ClipboardChangeListener,
    unsubscribe: ClipboardUnsubscribe
];

/**
 * Provides clipboard writing functionality with a listener mechanism
 * for tracking successful copy operations.
 *
 * @returns A tuple containing the copy function, listener registration
 * function, and unsubscribe function.
 *
 * @example
 * ```js
 * const [copy, watch, unsubscribe] = useClipboard();
 *
 * watch((text) => {
 *     console.log("Copied:", text);
 * });
 *
 * await copy("Hello ZikoJS");
 * ```
 *
 * @example Unsubscribe all listeners
 * ```js
 * const [copy, watch, unsubscribe] = useClipboard();
 *
 * watch(console.log);
 *
 * await copy("ZikoJS");
 *
 * unsubscribe();
 * ```
 */
export declare function useClipboard(): UseClipboardResult;