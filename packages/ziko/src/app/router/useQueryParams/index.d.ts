export type QueryParams = Record<string, string>;

export type SetQueryParams = (
    updates:
        | QueryParams
        | ((current: QueryParams) => QueryParams),
    merge?: boolean
) => void;

export type GetQueryParams = () => QueryParams;

/**
 * Reactive query params hook-like utility
 * Returns:
 * - getParams: function that returns current query params
 * - setParams: function to update query params
 */
export function useQueryParams(): [
    GetQueryParams,
    SetQueryParams
];

/**
 * Watches URL query parameters changes.
 * Calls callback only when params actually change.
 *
 * Returns an unsubscribe function.
 */
export function watchQueryParams(
    callback: (params: QueryParams) => void
): () => void;