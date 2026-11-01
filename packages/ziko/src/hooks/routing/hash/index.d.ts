export type HashValue =
    | string
    | Record<string, unknown>
    | null
    | undefined;

export type HashUpdater = (
    current: string | Record<string, unknown>
) => HashValue;

export type HashListener = (
    hash: string | Record<string, unknown>
) => void;

/**
 * Creates a utility for reading, updating and observing the URL hash.
 *
 * Objects are serialized as JSON and automatically parsed when reading.
 *
 * @param initialValue - Initial hash value (string, object, null or undefined).
 *
 * @returns A tuple containing setHash and watchHash.
 *
 * @example
 * ```js
 * const [setHash, watchHash] = useHash("home");
 *
 * setHash("about");
 *
 * watchHash(hash => {
 *     console.log(hash);
 * });
 * ```
 *
 * @example
 * ```js
 * const [setHash, watchHash] = useHash({
 *     page: "home",
 *     tab: "profile"
 * });
 *
 * setHash({
 *     page: "dashboard",
 *     tab: "settings"
 * });
 * ```
 *
 * @example
 * ```js
 * const unsubscribe = watchHash(hash => {
 *     console.log(hash);
 * });
 *
 * unsubscribe();
 * ```
 */
export declare function useHash(
    initialValue?: HashValue
): [
    setHash: (value: HashUpdater) => string | Record<string, unknown>,
    watchHash: (callback: HashListener) => () => void
];