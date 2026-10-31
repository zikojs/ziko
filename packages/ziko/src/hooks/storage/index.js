import { useIPC } from '../communication/ipc/index.js';
import { validateSchema } from '../../utils/schema/index.js';
import { isObject } from '../../utils/data/checkers/index.js'

const STORAGE_EVENT = 'Ziko-Storage-Updated';



function createStorage(
    storage,
    key,
    initialData,
    schema,
    useChannel = true
) {
    if (!storage) {
        throw new TypeError('A valid Storage instance is required');
    }
    if (typeof key !== 'string' || !key) {
        throw new TypeError('Storage key must be a non-empty string');
    }
    if (initialData !== undefined && !isObject(initialData)) {
        throw new TypeError('initialData must be an object');
    }
    const listeners = new Set();
    const channel = useChannel ? useIPC(`Ziko:Storage-${key}`) : null;
    // Read stored data.
    const read = () => {
        const raw = storage.getItem(key);
        if (raw === null) return undefined;
        try {
            const value = JSON.parse(raw);
            return isObject(value) ? value : {};
        } catch {
            return {};
        }
    };
    // Restore or initialize data.
    const storedData = read();
    let state;
    try {
        state = validateSchema(
            storedData ?? initialData ?? {},
            schema
        );
    } catch (error) {
        if (initialData === undefined) {
            throw error;
        }
        // Fallback to initial data when stored data is invalid.
        state = validateSchema(initialData, schema);
    }
    if (!isObject(state)) {
        throw new TypeError('Schema must produce an object');
    }
    // Persist initialized, recovered, or transformed data.
    if ( storedData === undefined || JSON.stringify(state) !== JSON.stringify(storedData)) {
        storage.setItem(key, JSON.stringify(state));
    }
    let data;
    // Notify subscribers.
    const notify = (next, previous) => {
        for (const callback of [...listeners]) {
            callback(next, previous);
        }
    };
    // Commit changes.
    const commit = (
        next,
        {
            persist = true,
            broadcast = true
        } = {}
    ) => {
        if (!isObject(next)) {
            throw new TypeError('Storage data must be an object');
        }
        // Validate and apply schema transformations.
        next = validateSchema(next, schema);
        if (!isObject(next)) {
            throw new TypeError('Schema must produce an object');
        }
        const previous = state;
        const serialized = JSON.stringify(next);
        if (serialized === JSON.stringify(previous)) return data;
        // Persist before updating in-memory state.
        if (persist) storage.setItem(key, serialized);
        state = next;
        notify(state, previous);
        if (broadcast && channel) channel.emit(STORAGE_EVENT, state);
        return data;
    };
    // Reactive data proxy.
    data = new Proxy({}, {
        get(_, prop) {
            if (prop === Symbol.toStringTag) {
                return 'StorageData';
            }
            if (prop === 'toJSON') {
                return () => state;
            }
            return state[prop];
        },
        set(_, prop, value) {
            commit({
                ...state,
                [prop]: value
            });
            return true;
        },
        deleteProperty(_, prop) {
            if (!Object.hasOwn(state, prop)) {
                return true;
            }
            const next = { ...state };
            delete next[prop];
            commit(next);
            return true;
        },
        has(_, prop) {
            return prop in state;
        },
        ownKeys() {
            return Reflect.ownKeys(state);
        },
        getOwnPropertyDescriptor(_, prop) {
            if (Object.hasOwn(state, prop)) {
                return {
                    configurable: true,
                    enumerable: true,
                    writable: true,
                    value: state[prop]
                };
            }
            return undefined;
        }
    });

    // Replace or update data.
    const setData = next => {
        const updates = typeof next === 'function'
            ? next({ ...state })
            : next;
        if (!isObject(updates)) {
            throw new TypeError('Storage data must be an object');
        }
        return commit({
            ...state,
            ...updates
        });
    };
    // Subscribe to changes.
    const watchData = callback => {
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }
        listeners.add(callback);
        return () => listeners.delete(callback);
    };

    // Synchronize updates through IPC.
    if (channel) {
        channel.on(STORAGE_EVENT, next => {
            if (isObject(next)) {
                commit(next, {
                    persist: false,
                    broadcast: false
                });
            }
        });
    }
    return [data, setData, watchData];
}

export const useLocalStorage = (
    key,
    initialData,
    schema,
    useChannel = true
) => createStorage(
    globalThis.localStorage,
    key,
    initialData,
    schema,
    useChannel
);

export const useSessionStorage = (
    key,
    initialData,
    schema,
    useChannel = true
) => createStorage(
    globalThis.sessionStorage,
    key,
    initialData,
    schema,
    useChannel
);
