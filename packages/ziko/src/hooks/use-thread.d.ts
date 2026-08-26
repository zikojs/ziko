// use-thread.d.ts

export declare class UseThread {
    constructor();

    /**
     * Call a function inside the worker.
     * @param func - Function to execute (cannot capture outer scope)
     * @param callback - Callback receiving (result, error)
     * @param args - Optional arguments array to pass to the function
     * @param close - Automatically close the worker after execution (default true)
     */
    call<T = any>(
        func: (...args: any[]) => T,
        callback: (result: T | null, error: string | null) => void,
        args?: any[],
        close?: boolean
    ): this;

    /** Terminate the worker manually */
    terminate(): void;
}

/**
 * Helper function for single-use worker threads.
 * Immediately executes the function and returns the UseThread instance.
 */
export declare const useThread: <T = any>(
    func: (...args: any[]) => T,
    callback: (result: T | null, error: string | null) => void,
    args?: any[],
    close?: boolean
) => UseThread;
