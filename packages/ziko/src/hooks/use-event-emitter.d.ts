declare class UseEventEmitter {
    constructor(maxListeners?: number);

    /**
     * Register and listen for an event.
     * The listener will be called every time the event is emitted.
     */
    on(event: string, listener: (...args: any[]) => void): this;

    /**
     * Register and listen for an event ONCE.
     * After the first call, the listener is automatically removed.
     */
    once(event: string, listener: (...args: any[]) => void): this;

    /**
     * Remove a specific listener.
     */
    off(event: string, listener: (...args: any[]) => void): this;

    /**
     * Emit an event and call all listeners associated with it.
     * Returns true if the event had listeners; otherwise false.
     */
    emit(event: string, data?: any): boolean;

    /**
     * Remove all listeners for a specific event.
     */
    remove(event: string): this;

    /**
     * Clear all events and their listeners.
     */
    clear(): this;

    /**
     * Set the maximum number of listeners allowed per event.
     */
    setMaxListeners(max: number): this;
}

/** Create a new event emitter instance */
declare const useEventEmitter: (maxListeners?: number) => UseEventEmitter;

export { UseEventEmitter, useEventEmitter };
