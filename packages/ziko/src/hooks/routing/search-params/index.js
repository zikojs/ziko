import { useEventEmitter } from '../../communication/event-emitter/index.js';
import {__init__global__} from '../../../__ziko__/index.js'
__init__global__()
const EVENT = Symbol.for('ziko/searchparamschange');
const PATCHED = Symbol.for('ziko/search-params/patched');
const EMITTER = Symbol.for('ziko/search-params/emitter');
const getEmitter = () => __Ziko__.__EVENT_EMITTER__[EMITTER] ??= useEventEmitter();
const normalizeInitialValue = value => {
    if (value == null) return {};
    if (typeof value === 'string') {
        return Object.fromEntries(
            new URLSearchParams(value.startsWith('?') ? value.slice(1) : value)
        );
    }
    if (typeof value === 'object' && !Array.isArray(value)) return { ...value };
    throw new TypeError('initialValue must be an object, string, null or undefined');
};

const parseQueryParams = (search, defaults = {}) => ({
    ...defaults,
    ...Object.fromEntries(new URLSearchParams(search))
});

function patchHistory() {
    const { history } = globalThis;
    if (history[PATCHED]) return;
    for (const method of ['pushState', 'replaceState']) {
        const original = history[method];
        history[method] = function (...args) {
            const previous = location.search;
            const result = original.apply(this, args);
            if (location.search !== previous) {
                getEmitter().emit(EVENT, location.search);
            }
            return result;
        };
    }
    Object.defineProperty(history, PATCHED, {
        value: true
    });
}

export function useSearchParams(initialValue) {
    const defaults = normalizeInitialValue(initialValue);
    let unsubscribe = null;
    const getParams = () => parseQueryParams(location.search, defaults);
    const setParams = (updates, merge = true) => {
        const current = getParams();
        const next = typeof updates === 'function' ? updates(current) : updates;
        if (!next || typeof next !== 'object' || Array.isArray(next))
            throw new TypeError('Updates must be an object');
        const finalParams = merge ? { ...current, ...next } : { ...next };
        const params = new URLSearchParams();
        for (const [key, value] of Object.entries(finalParams)) {
            if (value != null) params.set(key, String(value));
        }
        const search = params.toString();
        const url = `${location.pathname}${search ? `?${search}` : ''}${location.hash}`;
        if (url === `${location.pathname}${location.search}${location.hash}`)
            return finalParams;
        history.pushState({}, '', url);
        return finalParams;
    };

    const watchParams = (callback, options = {}) => {
        if (typeof callback !== 'function') throw new TypeError('callback must be a function');
        patchHistory();
        unsubscribe?.();
        const { signal } = options;
        if (signal?.aborted) {
            unsubscribe = null;
            return () => {};
        }
        let previousSearch = location.search;
        let active = true;
        const notify = () => {
            if (!active || location.search === previousSearch) return;
            previousSearch = location.search;
            callback(getParams());
        };
        const notifyNative = () => {
            if (!active || location.search === previousSearch) return;
            previousSearch = location.search;
            callback(getParams());
        };
        const emitter = getEmitter();
        emitter.on(EVENT, notify, options);
        addEventListener('popstate', notifyNative);
        const cleanup = () => {
            if (!active) return;
            active = false;
            emitter.off(EVENT, notify);
            removeEventListener('popstate', notifyNative);
            signal?.removeEventListener('abort', cleanup);
            if (unsubscribe === cleanup) {
                unsubscribe = null;
            }
        };
        signal?.addEventListener('abort', cleanup, { once: true });
        unsubscribe = cleanup;
        callback(getParams());
        return cleanup;
    };
    return [
        setParams,
        watchParams,
        () => unsubscribe?.()
    ];
}