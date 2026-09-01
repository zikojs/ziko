export declare class UseFavIcon {
    /**
     * Create a favicon manager.
     * @param FavIcon Initial favicon URL.
     * @param withEmitter Whether to enable an internal event emitter (default: true).
     */
    constructor(FavIcon?: string, withEmitter?: boolean);

    /**
     * Sets the favicon URL.
     * Emits "ziko:favicon-changed" if emitter is enabled.
     */
    setFavicon(href: string): this;

    /**
     * Returns the current favicon URL.
     */
    readonly current: string;

    /**
     * Listen for favicon changes.
     * Callback receives the new href as a string.
     */
    onChange(callback: (href: string) => void): this;

    /**
     * To Do 
     * Disable or remove the internal event emitter entirely.
     */
    removeEventEmitter(): this;

    /**
     * Enable the internal event emitter manually.
     */
    useEventEmitter(): this;
}

/**
 * Factory function to create a `UseFavIcon` instance.
 */
export declare const useFavIcon: (FavIcon?: string, withEmitter?: boolean) => UseFavIcon;
