import type {
    StateGetter,
} from '../../state/index.js';
/**
 * Subscribes to browser network connectivity changes.
 *
 * Tracks the browser's online status using `navigator.onLine`
 * and listens to the `online` and `offline` window events.
 *
 * @param withEmitter - Whether to enable change event subscriptions. Defaults to true.
 *
 * @returns A tuple containing:
 * - `isOnline`: Reactive boolean state representing the connection status.
 * - `refresh`: Function to manually refresh the connection status.
 * - `onChange`: Event subscription function (only available when `withEmitter` is true).
 *
 * @example
 * ```ts
 * const [isOnline, refresh, onChange] = useOnline();
 *
 * console.log(isOnline().value);
 *
 * onChange(online => {
 *     console.log(online ? 'Online' : 'Offline');
 * });
 * ```
 *
 * @example
 * ```ts
 * const [isOnline, refresh] = useOnline(false);
 *
 * console.log(isOnline().value);
 * refresh();
 * ```
 */
export declare function useOnline(
    withEmitter?: true
): [
    isOnline: StateGetter<boolean>,
    refresh: () => void,
    onChange: (callback: (online: boolean) => void) => void
];

/**
 * @see useOnline
 */
export declare function useOnline(
    withEmitter: false
): [
    isOnline: StateGetter<boolean>,
    refresh: () => void
];