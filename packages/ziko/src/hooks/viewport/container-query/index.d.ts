export type ContainerQueryCondition = (
    width: number,
    height: number,
    element: Element
) => boolean;

export interface ContainerQueryRule {
    query: ContainerQueryCondition;
    callback: () => void;
}

export type ContainerQueryFallback = () => void;

export type ContainerQueryChangeListener = (
    current: ContainerQueryRule | null,
    previous: ContainerQueryRule | null
) => void;

/**
 * Observes an element's dimensions and executes the callback
 * associated with the first matching query.
 *
 * @example
 * ```js
 * const container = document.querySelector("#container");
 *
 * const query = useContainerQuery(container, [
 *     {
 *         query: width => width <= 400,
 *         callback: () => console.log("Small")
 *     },
 *     {
 *         query: width => width <= 800,
 *         callback: () => console.log("Medium")
 *     },
 *     {
 *         query: width => width > 800,
 *         callback: () => console.log("Large")
 *     }
 * ], () => console.log("Fallback"));
 * ```
 *
 * @example
 * ```js
 * query.onChange((current, previous) => {
 *     console.log(current?.query, previous?.query);
 * });
 *
 * query.destroy();
 * ```
 */
export declare class ContainerQuery {
    constructor(
        element: Element,
        rules?: ContainerQueryRule[],
        fallback?: ContainerQueryFallback
    );

    /** Currently active rule. */
    readonly current: ContainerQueryRule | null;

    /** Whether any rule currently matches. */
    readonly matches: boolean;

    /** Current container width in pixels. */
    readonly width: number;

    /** Current container height in pixels. */
    readonly height: number;

    /**
     * Subscribe to changes in the active rule.
     * @returns Unsubscribe function.
     */
    onChange(callback: ContainerQueryChangeListener): () => void;

    /** Manually re-evaluate all rules. */
    update(): this;

    /** Stop observing and remove listeners. */
    destroy(): void;
}

/**
 * Creates a container query observer.
 *
 * @example
 * ```js
 * const query = useContainerQuery(
 *     document.querySelector("#container"),
 *     [
 *         {
 *             query: width => width < 500,
 *             callback: () => console.log("Mobile")
 *         },
 *         {
 *             query: width => width >= 500,
 *             callback: () => console.log("Desktop")
 *         }
 *     ],
 *     () => console.log("Fallback")
 * );
 * ```
 */
export declare function useContainerQuery(
    element: Element,
    rules?: ContainerQueryRule[],
    fallback?: ContainerQueryFallback
): ContainerQuery;