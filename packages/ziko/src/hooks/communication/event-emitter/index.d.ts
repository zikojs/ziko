
export type EventMap = object;

/**
 * Listener for a typed event.
 *
 * Events with tuple payloads receive multiple arguments.
 * Other events receive a single argument.
 */
export type EventListener<T = unknown> =
    T extends unknown[]
        ? (...args: T) => void
        : (data: T) => void;

/**
 * Listener invoked for every emitted event.
 *
 * @example
 * emitter.on("*", (event, ...args) => {
 *     console.log(event, args);
 * });
 */
export type WildcardListener<
    Events extends EventMap
> = <K extends keyof Events>(
    event: K,
    ...args: Events[K] extends void
        ? [data?: undefined]
        : Events[K] extends unknown[]
            ? Events[K]
            : [Events[K]]
) => void;

export interface EventListenerOptions {
    /**
     * Automatically unregisters the listener when aborted.
     */
    signal?: AbortSignal;
}

export interface WaitForOptions {
    /**
     * Rejects the promise if the signal is aborted.
     */
    signal?: AbortSignal;

    /**
     * Maximum time to wait in milliseconds.
     * Rejects with a TimeoutError if exceeded.
     */
    timeout?: number;
}

/**
 * Resolves to the emitted value.
 * Multiple arguments resolve to a tuple.
 */
export type WaitForResult<T> =
    T extends void
        ? undefined
        : T extends unknown[]
            ? T extends [infer Only]
                ? Only
                : T
            : T;

export declare class EventEmitter<
    Events extends EventMap = Record<string, unknown>
> {
    /**
     * Creates an event emitter.
     *
     * @param maxListeners Maximum listeners per event.
     * Set to 0 to disable the listener warning.
     *
     * @example
     * const emitter = new EventEmitter<AppEvents>(20);
     */
    constructor(maxListeners?: number);

    /**
     * Registers a listener.
     *
     * @param event Event name.
     * @param listener Callback for the event.
     * @param options Optional AbortSignal.
     *
     * @example
     * emitter.on("message", ({ text }) => {
     *     console.log(text);
     * });
     *
     * @example
     * const controller = new AbortController();
     *
     * emitter.on("message", console.log, {
     *     signal: controller.signal
     * });
     *
     * controller.abort();
     */
    on<K extends keyof Events>(
        event: K,
        listener: EventListener<Events[K]>,
        options?: EventListenerOptions
    ): this;

    /**
     * Registers a wildcard listener for all emitted events.
     * The callback receives the event name followed by its arguments.
     *
     * @example
     * emitter.on("*", (event, ...args) => {
     *     console.log(event, args);
     * });
     */
    on(
        event: "*",
        listener: WildcardListener<Events>,
        options?: EventListenerOptions
    ): this;

    /**
     * Registers a listener that runs at most once.
     *
     * @example
     * emitter.once("ready", () => {
     *     console.log("Ready!");
     * });
     */
    once<K extends keyof Events>(
        event: K,
        listener: EventListener<Events[K]>,
        options?: EventListenerOptions
    ): this;

    /**
     * Removes listeners matching the callback.
     * Passing the original callback also removes its once wrapper.
     *
     * @example
     * const handler = (value: number) => console.log(value);
     *
     * emitter.on("count", handler);
     * emitter.off("count", handler);
     */
    off(
        event: keyof Events | "*",
        listener: (...args: any[]) => void
    ): this;

    /**
     * Emits an event.
     *
     * @returns true if listeners were present; otherwise false.
     *
     * @example
     * emitter.emit("message", { text: "Hello" });
     * emitter.emit("data", "hello", 42);
     * emitter.emit("ready");
     */
    emit<K extends keyof Events>(
        event: K,
        ...args: Events[K] extends void
            ? [data?: undefined]
            : Events[K] extends unknown[]
                ? Events[K]
                : [Events[K]]
    ): boolean;

    /**
     * Waits for the next occurrence of an event.
     *
     * Resolves with undefined for a void event, the value for
     * a single argument, or a tuple for multiple arguments.
     *
     * @example
     * const message = await emitter.waitFor("message");
     *
     * @example
     * const message = await emitter.waitFor("message", {
     *     timeout: 5000
     * });
     *
     * @example
     * const controller = new AbortController();
     * const pending = emitter.waitFor("ready", {
     *     signal: controller.signal
     * });
     * controller.abort();
     */
    waitFor<K extends keyof Events>(
        event: K,
        options?: WaitForOptions
    ): Promise<WaitForResult<Events[K]>>;

    /**
     * Removes all listeners for an event.
     */
    remove(event: keyof Events | "*"): this;

    /**
     * Removes listeners for one event, or all events if omitted.
     *
     * @example
     * emitter.removeAllListeners("message");
     * emitter.removeAllListeners();
     */
    removeAllListeners(event?: keyof Events | "*"): this;

    /**
     * Returns the number of listeners for an event.
     */
    listenerCount(event: keyof Events | "*"): number;

    /**
     * Returns registered event names.
     */
    eventNames(): (keyof Events | "*")[];

    /**
     * Removes all registered listeners.
     */
    clear(): this;

    /**
     * Sets the maximum listeners before warnings are emitted.
     * Use 0 to disable warnings.
     */
    setMaxListeners(max: number): this;
}

/**
 * Creates a new EventEmitter instance.
 *
 * @example
 * interface AppEvents {
 *     message: { text: string };
 *     count: number;
 *     ready: void;
 *     data: [string, number];
 * }
 *
 * const emitter = useEventEmitter<AppEvents>();
 *
 * emitter.on("message", ({ text }) => console.log(text));
 * emitter.emit("message", { text: "Hello" });
 *
 * emitter.on("*", (event, ...args) => {
 *     console.log(event, args);
 * });
 *
 * const message = await emitter.waitFor("message");
 * // { text: string }
 */
export declare function useEventEmitter<
    Events extends EventMap = Record<string, unknown>
>(
    maxListeners?: number
): EventEmitter<Events>;
