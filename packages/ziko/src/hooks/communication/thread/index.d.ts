
/**
 * Callback invoked when a worker task completes or fails.
 *
 * @template TResult The expected result type.
 * @param result The task result, or `undefined` if it failed.
 * @param error Error message when the task fails.
 */
export type ThreadCallback<TResult = unknown> = (
    result: TResult | undefined,
    error?: string
) => void;

/**
 * A function executed inside a Web Worker.
 *
 * The function cannot access variables from its original lexical scope.
 * Pass external values through `args` instead.
 *
 * @template TArgs Argument tuple.
 * @template TResult Return value.
 */
export type ThreadFunction<
    TArgs extends unknown[] = unknown[],
    TResult = unknown
> = (...args: TArgs) => TResult | Promise<TResult>;

/**
 * Executes functions inside a Web Worker.
 *
 * Supports multiple tasks until the thread is terminated or a call
 * requests closure.
 *
 * @example
 * const thread = new Thread();
 *
 * thread.call(
 *     (a: number, b: number) => a + b,
 *     (result, error) => {
 *         if (error) return console.error(error);
 *         console.log(result); // 5
 *     },
 *     [2, 3]
 * );
 *
 * thread.terminate();
 */
export declare class Thread {
    constructor();

    /**
     * Executes a function in the worker.
     *
     * @param func Function to execute. It must be serializable as source code.
     * @param callback Receives the result and an optional error message.
     * @param args Arguments passed to the function.
     * @param close Whether to close the worker after all pending tasks finish.
     * Defaults to `false`.
     * @returns The current Thread instance.
     *
     * @example
     * thread.call(
     *     (value: number) => value * value,
     *     (result, error) => console.log(result, error),
     *     [4]
     * );
     */
    call<
        TArgs extends unknown[],
        TResult
    >(
        func: ThreadFunction<TArgs, TResult>,
        callback: ThreadCallback<TResult>,
        args?: TArgs,
        close?: boolean
    ): this;

    /**
     * Terminates the worker and reports an error to pending callbacks.
     *
     * @example
     * thread.terminate();
     */
    terminate(): void;
}

/**
 * Creates a Thread, executes one task, and closes the worker afterward.
 *
 * @template TArgs Argument tuple.
 * @template TResult Return value.
 * @param func Function to execute in the worker.
 * @param callback Receives the result or an error message.
 * @param args Arguments passed to the function.
 * @param close Whether to close the worker after pending tasks finish.
 * Defaults to `true`.
 * @returns The Thread instance.
 *
 * @example
 * useThread(
 *     (a: number, b: number) => a + b,
 *     (result, error) => {
 *         if (error) {
 *             console.error(error);
 *             return;
 *         }
 *
 *         console.log(result); // 5
 *     },
 *     [2, 3]
 * );
 */
export declare function useThread<
    TArgs extends unknown[],
    TResult
>(
    func: ThreadFunction<TArgs, TResult>,
    callback: ThreadCallback<TResult>,
    args?: TArgs,
    close?: boolean
): Thread;
