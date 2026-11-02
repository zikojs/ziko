export type OnlineChangeCallback = (isOnline: boolean) => void;

export type OnlineChangeListener = (
    callback: OnlineChangeCallback
) => void;

export type OnlineUnsubscribe = () => void;

export type UseOnlineResult = [
    watch: OnlineChangeListener,
    unsubscribe: OnlineUnsubscribe
];

/**
 * Observes the browser's online/offline status.
 *
 * Registers callbacks that receive the current online status immediately,
 * then receive updates whenever the browser fires an online or offline event.
 *
 * @returns A tuple containing the listener registration function
 * and the unsubscribe function.
 *
 * @example
 * ```js
 * const [watch, unsubscribe] = useOnline();
 *
 * watch((isOnline) => {
 *     console.log(isOnline ? "Online" : "Offline");
 * });
 * ```
 *
 * @example
 * ```js
 * const [watch, unsubscribe] = useOnline();
 *
 * const callback = (isOnline) => {
 *     console.log("Connection status:", isOnline);
 * };
 *
 * watch(callback);
 *
 * // Removes all listeners and stops observing connection changes.
 * unsubscribe();
 * ```
 */
export declare function useOnline(): UseOnlineResult;