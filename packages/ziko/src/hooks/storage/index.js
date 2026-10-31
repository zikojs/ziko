import { useIPC } from '../communication/ipc/index.js';
import { isObject } from '../../utils/data/checkers/index.js';

const STORAGE_EVENT = 'Ziko-Storage-Updated';

function createStorage(storage, key, initialData, useChannel = true) {
    if (!storage) throw new TypeError('A valid Storage instance is required');
    if (typeof key !== 'string' || !key) throw new TypeError('Storage key must be a non-empty string');
    if (initialData !== undefined && !isObject(initialData)) throw new TypeError('initialData must be an object');

    const listeners = new Set();
    const channel = useChannel ? useIPC(`Ziko:Storage-${key}`) : null;

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

    let state = read() ?? initialData ?? {};
    if (storage.getItem(key) === null) storage.setItem(key, JSON.stringify(state));

    let data;

    const notify = (next, previous) => {
        for (const callback of [...listeners]) callback(next, previous);
    };

    const commit = (next, { persist = true, broadcast = true } = {}) => {
        if (!isObject(next)) throw new TypeError('Storage data must be an object');

        const previous = state;
        const serialized = JSON.stringify(next);
        if (serialized === JSON.stringify(previous)) return data;

        if (persist) storage.setItem(key, serialized);
        state = next;
        notify(state, previous);
        if (broadcast && channel) channel.emit(STORAGE_EVENT, state);

        return data;
    };

    data = new Proxy({}, {
        get(_, prop) {
            if (prop === Symbol.toStringTag) return 'StorageData';
            if (prop === 'toJSON') return () => state;
            return state[prop];
        },
        set(_, prop, value) {
            commit({ ...state, [prop]: value });
            return true;
        },
        deleteProperty(_, prop) {
            if (!Object.hasOwn(state, prop)) return true;
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
            if (Object.hasOwn(state, prop)) return {
                configurable: true,
                enumerable: true,
                writable: true,
                value: state[prop]
            };
        }
    });

    const setData = next => {
        const updates = typeof next === 'function' ? next({ ...state }) : next;
        if (!isObject(updates)) throw new TypeError('Storage data must be an object');
        return commit({ ...state, ...updates });
    };

    const watchData = callback => {
        if (typeof callback !== 'function') throw new TypeError('callback must be a function');
        listeners.add(callback);
        return () => listeners.delete(callback);
    };

    if (channel) channel.on(STORAGE_EVENT, next => {
        if (isObject(next)) commit(next, { persist: false, broadcast: false });
    });

    return [data, setData, watchData];
}

export const useLocalStorage = (key, initialData, useChannel = true) =>
    createStorage(globalThis.localStorage, key, initialData, useChannel);

export const useSessionStorage = (key, initialData, useChannel = true) =>
    createStorage(globalThis.sessionStorage, key, initialData, useChannel);