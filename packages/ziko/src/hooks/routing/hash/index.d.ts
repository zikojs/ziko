export type HashValue = string | null | undefined;

export type HashUpdater = (
    current: string
) => HashValue;

export type HashListener = (
    hash: string
) => void;

/**
 * Creates a utility for reading, updating and observing the URL hash.
 *
 * The hash is normalized: the leading `#` is excluded from returned values.
 *
 * @param initialValue - Initial hash value. Sets the URL hash only if it is empty.
 *
 * @returns A tuple containing:
 * - `setHash`: Updates the URL hash.
 * - `watchHash`: Observes hash changes and returns an unsubscribe function.
 *
 * @example
 * Basic usage:
 * ```js
 * const [setHash, watchHash] = useHash("home");
 *
 * setHash("about");
 *
 * console.log(location.hash); // "#about"
 * ```
 *
 * @example
 * Initialize without a hash:
 * ```js
 * const [setHash] = useHash();
 *
 * setHash("dashboard");
 * ```
 *
 * @example
 * Functional updates:
 * ```js
 * const [setHash] = useHash("home");
 *
 * setHash(current => `${current}/settings`);
 *
 * console.log(location.hash); // "#home/settings"
 * ```
 *
 * @example
 * Clear the hash:
 * ```js
 * const [setHash] = useHash("home");
 *
 * setHash(null);
 * // or
 * setHash(undefined);
 *
 * console.log(location.hash); // ""
 * ```
 *
 * @example
 * Observe hash changes:
 * ```js
 * const [setHash, watchHash] = useHash("home");
 *
 * const unsubscribe = watchHash(hash => {
 *     console.log("Current hash:", hash);
 * });
 *
 * setHash("about"); // "Current hash: about"
 *
 * unsubscribe();
 * ```
 *
 * @example
 * TypeScript:
 * ```ts
 * const [setHash, watchHash] = useHash("home");
 *
 * setHash("profile");
 *
 * setHash(current => `${current}/settings`);
 *
 * setHash(null);
 *
 * const unsubscribe = watchHash((hash: string) => {
 *     console.log(hash);
 * });
 *
 * unsubscribe();
 * ```
 */
export declare function useHash(
    initialValue?: HashValue
): [
    setHash: (value: HashValue | HashUpdater) => string,
    watchHash: (callback: HashListener) => () => void
];