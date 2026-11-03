import {__init__global__} from '../../../__ziko__/index.js'
import { useEventEmitter } from '../../communication/event-emitter/index.js';

__init__global__()

const EVENT = Symbol.for('ziko/hashchange');
const PATCHED = Symbol.for('ziko/hash/patched');
const EMITTER = Symbol.for('ziko/hash/emitter');

const getEmitter = () => {
    return __Ziko__.__EVENT_EMITTER__[EMITTER] ??= useEventEmitter();
};

const normalizeHash = value => {
    if (value == null) return '';
    if (typeof value === 'string') return value.replace(/^#/, '');

    throw new TypeError('Hash value must be a string, null or undefined');
};

const getHash = () => location.hash.replace(/^#/, '');

export function patchHistory() {
    const { history } = globalThis;
    const emitter = getEmitter();

    if (history[PATCHED]) return emitter;

    for (const method of ['pushState', 'replaceState']) {
        const original = history[method];

        history[method] = function (...args) {
            const previousHash = location.hash;

            const result = original.apply(this, args);

            if (location.hash !== previousHash) {
                emitter.emit(EVENT, getHash());
            }

            return result;
        };
    }

    Object.defineProperty(history, PATCHED, {
        value: true,
        configurable: true
    });

    return emitter;
}

export function useHash(initialValue) {
    const initialHash = normalizeHash(initialValue);

    let unsubscribe = null;

    const setHash = value => {
        const next = normalizeHash(
            typeof value === 'function' ? value(getHash()) : value
        );

        const hash = next ? `#${next}` : '';

        if (location.hash === hash) return getHash();

        history.pushState(
            {},
            '',
            `${location.pathname}${location.search}${hash}`
        );

        return getHash();
    };

    const watchHash = (callback, options = {}) => {
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }

        const emitter = patchHistory();

        unsubscribe?.();

        const { signal } = options;

        if (signal?.aborted) return () => {};

        let previousHash = location.hash;
        let active = true;

        const notify = hash => {
            if (!active || location.hash === previousHash) return;

            previousHash = location.hash;
            callback(hash);
        };

        const notifyNative = () => {
            if (!active || location.hash === previousHash) return;

            previousHash = location.hash;
            callback(getHash());
        };

        const cleanup = () => {
            if (!active) return;

            active = false;

            emitter.off(EVENT, notify);
            removeEventListener('hashchange', notifyNative);
            removeEventListener('popstate', notifyNative);

            signal?.removeEventListener('abort', cleanup);

            if (unsubscribe === cleanup) unsubscribe = null;
        };

        emitter.on(EVENT, notify, options);

        addEventListener('hashchange', notifyNative);
        addEventListener('popstate', notifyNative);

        signal?.addEventListener('abort', cleanup, { once: true });

        unsubscribe = cleanup;

        callback(getHash());

        return cleanup;
    };

    if (!location.hash && initialHash) {
        setHash(initialHash);
    }

    return [
        setHash,
        watchHash,
        () => unsubscribe?.()
    ];
}