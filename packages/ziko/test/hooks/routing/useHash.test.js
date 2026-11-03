import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from 'vitest';

import { useHash } from 'ziko/hooks/routing';

const PATCHED = Symbol.for('ziko/hash/patched');

describe('useHash', () => {
    let originalPushState;
    let originalReplaceState;
    let originalZiko;
    let cleanups;

    const track = cleanup => {
        cleanups.push(cleanup);
        return cleanup;
    };

    beforeEach(() => {
        originalPushState = history.pushState;
        originalReplaceState = history.replaceState;
        originalZiko = globalThis.__Ziko__;
        cleanups = [];

        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;

        delete history[PATCHED];

        history.replaceState({}, '', '/');

        globalThis.__Ziko__ = {
            ...originalZiko,
            __EVENT_EMITTER__: {}
        };
    });

    afterEach(() => {
        cleanups.forEach(cleanup => cleanup());

        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;

        delete history[PATCHED];

        globalThis.__Ziko__ = originalZiko;

        vi.restoreAllMocks();
    });

    /* Initialization */

    it('should initialize with the provided hash when URL hash is empty', () => {
        useHash('home');

        expect(location.hash).toBe('#home');
    });

    it('should not override an existing hash', () => {
        history.replaceState({}, '', '/#existing');

        useHash('home');

        expect(location.hash).toBe('#existing');
    });

    it('should initialize without a hash', () => {
        const [setHash] = useHash();

        expect(location.hash).toBe('');
        expect(setHash).toBeTypeOf('function');
    });

    it('should accept null and undefined as initial values', () => {
        expect(() => useHash(null)).not.toThrow();
        expect(() => useHash(undefined)).not.toThrow();
    });

    it('should reject invalid initial values', () => {
        expect(() => useHash(123)).toThrow(TypeError);
        expect(() => useHash({ hash: 'home' })).toThrow(TypeError);
    });

    /* setHash */

    it('should set the hash', () => {
        const [setHash] = useHash();

        expect(setHash('about')).toBe('about');
        expect(location.hash).toBe('#about');
    });

    it('should normalize the leading #', () => {
        const [setHash] = useHash();

        setHash('#about');

        expect(location.hash).toBe('#about');
    });

    it('should clear the hash with null', () => {
        const [setHash] = useHash('home');

        setHash(null);

        expect(location.hash).toBe('');
    });

    it('should clear the hash with undefined', () => {
        const [setHash] = useHash('home');

        setHash(undefined);

        expect(location.hash).toBe('');
    });

    it('should support functional updates', () => {
        const [setHash] = useHash('home');

        setHash(current => `${current}/settings`);

        expect(location.hash).toBe('#home/settings');
    });

    it('should return the current hash when unchanged', () => {
        const [setHash] = useHash('home');

        expect(setHash('home')).toBe('home');
    });

    it('should reject invalid values', () => {
        const [setHash] = useHash();

        expect(() => setHash(123)).toThrow(TypeError);
        expect(() => setHash({})).toThrow(TypeError);
        expect(() => setHash(() => 123)).toThrow(TypeError);
    });

    /* watchHash */

    it('should call the callback immediately', () => {
        const [, watchHash] = useHash('home');
        const callback = vi.fn();

        track(watchHash(callback));

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith('home');
    });

    it('should observe changes made with setHash', () => {
        const [setHash, watchHash] = useHash('home');
        const callback = vi.fn();

        track(watchHash(callback));
        callback.mockClear();

        setHash('about');

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith('about');
    });

    it('should observe changes made with history.pushState', () => {
        const [, watchHash] = useHash('home');
        const callback = vi.fn();

        track(watchHash(callback));
        callback.mockClear();

        history.pushState({}, '', '/#about');

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith('about');
    });

    it('should observe changes made with history.replaceState', () => {
        const [, watchHash] = useHash('home');
        const callback = vi.fn();

        track(watchHash(callback));
        callback.mockClear();

        history.replaceState({}, '', '/#about');

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith('about');
    });

    it('should not notify when the hash does not change', () => {
        const [, watchHash] = useHash('home');
        const callback = vi.fn();

        track(watchHash(callback));
        callback.mockClear();

        history.pushState({}, '', '/#home');

        expect(callback).not.toHaveBeenCalled();
    });

    it('should reject invalid callbacks', () => {
        const [, watchHash] = useHash();

        expect(() => watchHash(null)).toThrow(TypeError);
        expect(() => watchHash('invalid')).toThrow(TypeError);
    });

    /* Unsubscribe */

    it('should stop observing after unsubscribe', () => {
        const [setHash, watchHash] = useHash('home');
        const callback = vi.fn();

        const unsubscribe = track(watchHash(callback));
        callback.mockClear();

        unsubscribe();
        setHash('about');

        expect(callback).not.toHaveBeenCalled();
    });

    it('should allow repeated unsubscribe calls', () => {
        const [, watchHash] = useHash();

        const unsubscribe = track(watchHash(vi.fn()));

        expect(() => unsubscribe()).not.toThrow();
        expect(() => unsubscribe()).not.toThrow();
    });

    it('should replace the previous watcher', () => {
        const [setHash, watchHash] = useHash('home');
        const first = vi.fn();
        const second = vi.fn();

        track(watchHash(first));
        track(watchHash(second));

        first.mockClear();
        second.mockClear();

        setHash('about');

        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledOnce();
        expect(second).toHaveBeenCalledWith('about');
    });

    it('should expose a third unsubscribe function', () => {
        const [, , unsubscribe] = useHash();

        expect(unsubscribe).toBeTypeOf('function');
    });

    it('should unsubscribe through the third tuple function', () => {
        const [setHash, watchHash, unsubscribe] = useHash('home');
        const callback = vi.fn();

        track(watchHash(callback));
        callback.mockClear();

        unsubscribe();
        setHash('about');

        expect(callback).not.toHaveBeenCalled();
    });

    /* AbortSignal */

    it('should stop observing when the signal is aborted', () => {
        const [setHash, watchHash] = useHash('home');
        const controller = new AbortController();
        const callback = vi.fn();

        track(watchHash(callback, { signal: controller.signal }));
        callback.mockClear();

        controller.abort();
        setHash('about');

        expect(callback).not.toHaveBeenCalled();
    });

    it('should not subscribe when the signal is already aborted', () => {
        const [, watchHash] = useHash();
        const controller = new AbortController();
        const callback = vi.fn();

        controller.abort();

        const unsubscribe = watchHash(callback, {
            signal: controller.signal
        });

        expect(callback).not.toHaveBeenCalled();
        expect(unsubscribe).toBeTypeOf('function');
    });

    /* Native browser events */

    it('should observe popstate changes', () => {
        const [, watchHash] = useHash('home');
        const callback = vi.fn();

        track(watchHash(callback));
        callback.mockClear();

        history.replaceState({}, '', '/#about');
        dispatchEvent(new PopStateEvent('popstate'));

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith('about');
    });

    it('should observe hashchange events', () => {
        const [, watchHash] = useHash('home');
        const callback = vi.fn();

        track(watchHash(callback));
        callback.mockClear();

        history.replaceState({}, '', '/#about');
        dispatchEvent(new HashChangeEvent('hashchange'));

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith('about');
    });

    it('should not notify twice for the same hash', () => {
        const [, watchHash] = useHash('home');
        const callback = vi.fn();

        track(watchHash(callback));
        callback.mockClear();

        history.replaceState({}, '', '/#about');

        dispatchEvent(new PopStateEvent('popstate'));
        dispatchEvent(new HashChangeEvent('hashchange'));

        expect(callback).toHaveBeenCalledOnce();
    });
});