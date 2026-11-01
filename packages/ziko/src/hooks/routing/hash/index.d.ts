
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
 * @param initialValue - Initial hash value. Sets the URL hash only if it is empty.
 *
 * @returns A tuple containing `setHash` and `watchHash`.
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
 * setHash("about");
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
 * setHash(current => `${current}/settings`);
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
