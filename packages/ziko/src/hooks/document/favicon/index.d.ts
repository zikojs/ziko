export type FavIconChangeCallback = (href: string) => void;

export type FavIconChangeListener = (
    callback: FavIconChangeCallback
) => void;

export type FavIconStateSetter = (
    newHref: string | ((currentHref: string) => string)
) => void;

export type FavIconUnsubscribe = () => void;

export type UseFavIconResult = [
    setIcon: FavIconStateSetter,
    watchIcon: FavIconChangeListener,
    unsubscribe: FavIconUnsubscribe
];

/**
 * Manages the document favicon and provides a listener mechanism
 * for tracking favicon changes.
 *
 * @param initialHref - Initial favicon URL. Defaults to the current favicon.
 * @returns A tuple containing the setter, listener registration function,
 * and unsubscribe function.
 *
 * @example
 * ```js
 * const [setIcon, watchIcon, unsubscribe] = useFavicon("/favicon.png");
 *
 * watchIcon((href) => {
 *     console.log("Favicon changed:", href);
 * });
 *
 * setIcon("/dark-favicon.png");
 * ```
 *
 * @example Functional update
 * ```js
 * const [setIcon] = useFavicon("/favicon.png");
 *
 * setIcon((currentHref) =>
 *     currentHref.replace("light", "dark")
 * );
 * ```
 *
 * @example Unsubscribe all listeners
 * ```js
 * const [setIcon, watchIcon, unsubscribe] = useFavicon();
 *
 * watchIcon((href) => console.log(href));
 *
 * unsubscribe();
 *
 * // Updates the favicon without notifying listeners.
 * setIcon("/new-favicon.png");
 * ```
 */
export declare function useFavicon(
    initialHref?: string
): UseFavIconResult;