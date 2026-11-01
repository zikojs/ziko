export type SearchParamsValue = Record<string, unknown>;

export type SearchParamsInitialValue =
    | SearchParamsValue
    | string
    | null
    | undefined;

export type SearchParamsUpdater = (
    current: Record<string, string | unknown>
) => SearchParamsValue;

export type SearchParamsListener = (
    params: Record<string, string | unknown>
) => void;

/**
 * Creates a utility for reading, updating and observing URL search parameters.
 *
 * @param initialValue - Default parameters as an object, query string, null or undefined.
 *
 * @returns A tuple containing setParams and watchParams.
 *
 * @example
 * ```js
 * const [setParams, watchParams] = useSearchParams({
 *     page: 1,
 *     search: "",
 *     category: "all"
 * });
 *
 * setParams({ page: 2 });
 *
 * watchParams(params => {
 *     console.log(params);
 * });
 * ```
 *
 * @example
 * ```js
 * const [setParams, watchParams] = useSearchParams("?page=1&search=ziko");
 * ```
 *
 * @example
 * ```js
 * const [setParams, watchParams] = useSearchParams(null);
 * ```
 *
 * @example
 * ```js
 * const unsubscribe = watchParams(params => {
 *     console.log(params);
 * });
 *
 * unsubscribe();
 * ```
 */
export declare function useSearchParams(
    initialValue?: SearchParamsInitialValue
): [
    setParams: (
        updates: SearchParamsValue | SearchParamsUpdater,
        merge?: boolean
    ) => SearchParamsValue,
    watchParams: (
        callback: SearchParamsListener
    ) => () => void
];