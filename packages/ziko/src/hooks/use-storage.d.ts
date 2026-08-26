// use-storage.d.ts

export declare class UseStorage {
    constructor(
        storage: Storage,
        globalKey: string,
        initialValue?: Record<string, any>,
        use_channel?: boolean
    );

    /** Current stored items */
    readonly items: Record<string, any>;

    /** Set entire storage */
    set(data: Record<string, any>): this;

    /** Merge new data into existing storage */
    add(data: Record<string, any>): this;

    /** Remove keys from storage */
    remove(...keys: string[]): this;

    /** Get a single key */
    get(key: string): any;

    /** Clear storage completely */
    clear(): this;

    /**
     * Listen for any storage updates.
     * Callback receives the data passed to the last .set() / .add() / .remove()
     */
    onStorageUpdated(callback: (data: Record<string, any>) => void): this;
}

/** Factory functions */
export declare const useLocaleStorage: (
    key: string,
    initialValue?: Record<string, any>,
    use_channel?: boolean
) => UseStorage;

export declare const useSessionStorage: (
    key: string,
    initialValue?: Record<string, any>,
    use_channel?: boolean
) => UseStorage;
