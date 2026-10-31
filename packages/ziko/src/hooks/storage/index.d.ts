export type StorageData<T extends Record<string, any>> = T;

export type StorageUpdater<T extends Record<string, any>> =
    | Partial<T>
    | ((previous: T) => Partial<T>);

export type StorageListener<T extends Record<string, any>> = (
    next: T,
    previous: T
) => void;

export type SetStorageData<T extends Record<string, any>> = (
    next: StorageUpdater<T>
) => T;

export type WatchStorageData<T extends Record<string, any>> = (
    callback: StorageListener<T>
) => () => boolean;

export type StorageReturn<T extends Record<string, any>> = [
    data: StorageData<T>,
    setData: SetStorageData<T>,
    watchData: WatchStorageData<T>
];

export declare function useLocalStorage<T extends Record<string, any>>(
    key: string,
    initialData?: T,
    useChannel?: boolean
): StorageReturn<T>;

export declare function useSessionStorage<T extends Record<string, any>>(
    key: string,
    initialData?: T,
    useChannel?: boolean
): StorageReturn<T>;