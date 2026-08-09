import type { StateGetter } from "./use-state.d.ts";


/**
 * Executes a side effect initially and whenever one of the
 * provided reactive state dependencies changes.
 *
 * The current values of the state dependencies are passed
 * to the callback in the same order as the dependency array.
 *
 * @param callback Effect callback receiving the current dependency values.
 * @param deps Reactive state getters to watch.
 * @returns A function that unsubscribes the effect and runs its cleanup.
 *
 * @example
 * const [count, setCount] = useState(0);
 *
 * useEffect(
 *     count => {
 *         console.log("Count:", count);
 *     },
 *     [count]
 * );
 *
 * // Count: 0
 *
 * setCount(1);
 * // Count: 1
 *
 * setCount(2);
 * // Count: 2
 *
 * setCount(3);
 * // Count: 3
 */
export declare function useEffect<T extends readonly unknown[]>(
    callback: (...values: T) => void | (() => void),
    deps: { [K in keyof T]: StateGetter<T[K]> }
): () => void;