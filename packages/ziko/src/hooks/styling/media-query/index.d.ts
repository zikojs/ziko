export interface MediaQueryRule {
    query: string;
    callback: () => void;
}

export type MediaQueryFallback = () => void;

export type MediaQueryChangeListener = (
    current: MediaQueryRule | null,
    previous: MediaQueryRule | null
) => void;

/**
 * Observes multiple CSS media queries and executes the callback
 * associated with the first matching rule.
 *
 * @example
 * ```js
 * const media = useMediaQuery([
 *     {
 *         query: "(max-width: 600px)",
 *         callback: () => console.log("Mobile")
 *     },
 *     {
 *         query: "(min-width: 601px) and (max-width: 1024px)",
 *         callback: () => console.log("Tablet")
 *     },
 *     {
 *         query: "(min-width: 1025px)",
 *         callback: () => console.log("Desktop")
 *     }
 * ], () => console.log("Fallback"));
 * ```
 *
 * @example
 * ```js
 * media.onChange((current, previous) => {
 *     console.log("Current:", current?.query);
 *     console.log("Previous:", previous?.query);
 * });
 *
 * media.destroy();
 * ```
 */
export declare class MediaQuery {
    constructor(
        rules?: MediaQueryRule[],
        fallback?: MediaQueryFallback
    );

    /** Currently active media query. */
    readonly current: string | null;

    /** Whether any media query currently matches. */
    readonly matches: boolean;

    /**
     * Subscribe to changes in the active media query.
     * @returns Unsubscribe function.
     */
    onChange(callback: MediaQueryChangeListener): () => void;

    /** Manually re-evaluate all media queries. */
    update(): this;

    /** Stop observing media queries and remove listeners. */
    destroy(): void;
}

/**
 * Creates a media query observer.
 *
 * @example
 * ```js
 * const media = useMediaQuery([
 *     {
 *         query: "(max-width: 768px)",
 *         callback: () => console.log("Mobile")
 *     },
 *     {
 *         query: "(min-width: 769px)",
 *         callback: () => console.log("Desktop")
 *     }
 * ], () => console.log("Fallback"));
 * ```
 *
 * @example
 * ```js
 * console.log(media.current);
 * console.log(media.matches);
 *
 * const unsubscribe = media.onChange((current, previous) => {
 *     console.log(current, previous);
 * });
 *
 * unsubscribe();
 * media.destroy();
 * ```
 */
export declare function useMediaQuery(
    rules?: MediaQueryRule[],
    fallback?: MediaQueryFallback
): MediaQuery;