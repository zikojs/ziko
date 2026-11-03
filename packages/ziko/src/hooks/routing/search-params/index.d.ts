export type SearchParamsValue = Record<string, unknown>;

export type SearchParamsInitialValue =
    | SearchParamsValue
    | string
    | null
    | undefined;

export type SearchParamsUpdater = (
    current: SearchParamsValue
) => SearchParamsValue;

export type SearchParamsListener = (
    params: SearchParamsValue
) => void;

/**
 * Creates a utility for reading, updating and observing URL search parameters.
 *
 * Values from the URL are returned as strings, while default values can have
 * any type. URL values override matching default values.
 *
 * @param initialValue - Default parameters as an object, query string, null or undefined.
 *                       Defaults are used only when a parameter is absent from the URL.
 *
 * @returns A tuple containing:
 * - `setParams`: Updates the URL search parameters.
 * - `watchParams`: Observes search parameter changes and returns an unsubscribe function.
 *
 * @example
 * Basic usage:
 * ```js
 * const [setParams, watchParams] = useSearchParams({
 *     page: 1,
 *     search: "",
 *     category: "all"
 * });
 *
 * setParams({ page: 2 });
 *
 * console.log(location.search); // "?page=2&search=&category=all"
 * ```
 *
 * @example
 * Initialize from a query string:
 * ```js
 * const [setParams, watchParams] = useSearchParams("?page=1&search=ziko");
 *
 * console.log(setParams({ page: 2 }));
 * // { page: 2, search: "ziko" }
 * ```
 *
 * @example
 * Initialize without default parameters:
 * ```js
 * const [setParams] = useSearchParams();
 *
 * setParams({
 *     page: 1,
 *     search: "ziko"
 * });
 * ```
 *
 * @example
 * Merge parameters:
 * ```js
 * const [setParams] = useSearchParams({
 *     page: 1,
 *     search: "ziko"
 * });
 *
 * setParams({ page: 2 });
 *
 * // Existing parameters are preserved.
 * // ?page=2&search=ziko
 * ```
 *
 * @example
 * Replace all parameters:
 * ```js
 * const [setParams] = useSearchParams({
 *     page: 1,
 *     search: "ziko"
 * });
 *
 * setParams({ category: "javascript" }, false);
 *
 * // ?category=javascript
 * ```
 *
 * @example
 * Functional updates:
 * ```js
 * const [setParams] = useSearchParams({ page: 1 });
 *
 * setParams(current => ({
 *     ...current,
 *     page: Number(current.page) + 1
 * }));
 * ```
 *
 * @example
 * Observe parameter changes:
 * ```js
 * const [setParams, watchParams] = useSearchParams({ page: 1 });
 *
 * const unsubscribe = watchParams(params => {
 *     console.log("Current parameters:", params);
 * });
 *
 * setParams({ page: 2 });
 *
 * unsubscribe();
 * ```
 *
 * @example
 * TypeScript:
 * ```ts
 * const [setParams, watchParams] = useSearchParams({
 *     page: 1,
 *     search: ""
 * });
 *
 * setParams({ page: 2 });
 *
 * setParams(current => ({
 *     ...current,
 *     page: Number(current.page) + 1
 * }));
 *
 * setParams({ search: "ziko" }, false);
 *
 * const unsubscribe = watchParams((params: SearchParamsValue) => {
 *     console.log(params.page, params.search);
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