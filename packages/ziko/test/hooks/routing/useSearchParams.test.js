import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSearchParams } from 'ziko/hooks/routing';

const PATCHED = Symbol.for('ziko/search-params/patched');

describe('useSearchParams', () => {
    let originalPushState, originalReplaceState, originalZiko, cleanups;

    const track = cleanup => (cleanups.push(cleanup), cleanup);
    const getParams = () => Object.fromEntries(new URLSearchParams(location.search));

    beforeEach(() => {
        originalPushState ??= history.pushState;
        originalReplaceState ??= history.replaceState;
        originalZiko = globalThis.__Ziko__;
        cleanups = [];

        originalReplaceState.call(history, {}, '', '/');
        globalThis.__Ziko__ = { ...originalZiko, __EVENT_EMITTER__: {} };
    });

    afterEach(() => {
        cleanups.forEach(cleanup => cleanup());
        originalReplaceState.call(history, {}, '', '/');
        globalThis.__Ziko__ = originalZiko;
        vi.restoreAllMocks();
    });

    /* Initialization */

    it('should initialize with default parameters', () => {
        const [setParams] = useSearchParams({ page: 1, sort: 'name' });
        expect(location.search).toBe('');
        expect(setParams({ page: 2 })).toEqual({ page: 2, sort: 'name' });
    });

    it('should preserve existing URL parameters', () => {
        originalReplaceState.call(history, {}, '', '/?page=2');
        const [setParams] = useSearchParams({ page: 1, sort: 'name' });
        expect(setParams({})).toEqual({ page: '2', sort: 'name' });
    });

    it('should accept a query string as initial value', () => {
        const [setParams] = useSearchParams('?page=1&sort=name');
        expect(setParams({})).toEqual({ page: '1', sort: 'name' });
    });

    it('should accept a query string without question mark', () => {
        const [setParams] = useSearchParams('page=1&sort=name');
        expect(setParams({})).toEqual({ page: '1', sort: 'name' });
    });

    it('should accept an empty initial value', () => {
        expect(() => useSearchParams()).not.toThrow();
        expect(() => useSearchParams(null)).not.toThrow();
        expect(() => useSearchParams(undefined)).not.toThrow();
    });

    it('should reject invalid initial values', () => {
        expect(() => useSearchParams(123)).toThrow(TypeError);
        expect(() => useSearchParams([])).toThrow(TypeError);
        expect(() => useSearchParams(true)).toThrow(TypeError);
    });

    /* setParams */

    it('should set parameters', () => {
        const [setParams] = useSearchParams();
        expect(setParams({ page: 1, sort: 'name' })).toEqual({ page: 1, sort: 'name' });
        expect(getParams()).toEqual({ page: '1', sort: 'name' });
    });

    it('should merge parameters by default', () => {
        const [setParams] = useSearchParams({ page: 1, sort: 'name' });
        setParams({ page: 2 });
        expect(getParams()).toEqual({ page: '2', sort: 'name' });
    });

    it('should replace parameters when merge is false', () => {
        const [setParams] = useSearchParams({ page: 1, sort: 'name' });
        setParams({ page: 2 }, false);
        expect(getParams()).toEqual({ page: '2' });
    });

    it('should support functional updates', () => {
        const [setParams] = useSearchParams({ page: '1' });
        setParams(current => ({ page: Number(current.page) + 1 }));
        expect(getParams()).toEqual({ page: '2' });
    });

    it('should stringify parameter values', () => {
        const [setParams] = useSearchParams();
        setParams({ page: 2, active: true });
        expect(getParams()).toEqual({ page: '2', active: 'true' });
    });

    it('should omit null and undefined values', () => {
        const [setParams] = useSearchParams();
        setParams({ page: 1, sort: null, filter: undefined });
        expect(getParams()).toEqual({ page: '1' });
    });

    it('should preserve pathname and hash', () => {
        originalReplaceState.call(history, {}, '', '/dashboard?old=1#section');
        const [setParams] = useSearchParams();
        setParams({ page: 2 });
        expect(location.pathname).toBe('/dashboard');
        expect(location.hash).toBe('#section');
        expect(getParams()).toEqual({ old: '1', page: '2' });
    });

    it('should return current parameters when unchanged', () => {
        const [setParams] = useSearchParams({ page: '1' });
        expect(setParams({})).toEqual({ page: '1' });
    });

    it('should reject invalid updates', () => {
        const [setParams] = useSearchParams();
        expect(() => setParams(null)).toThrow(TypeError);
        expect(() => setParams([])).toThrow(TypeError);
        expect(() => setParams(123)).toThrow(TypeError);
    });

    it('should reject invalid updater results', () => {
        const [setParams] = useSearchParams();
        expect(() => setParams(() => null)).toThrow(TypeError);
        expect(() => setParams(() => [])).toThrow(TypeError);
        expect(() => setParams(() => 123)).toThrow(TypeError);
    });

    /* watchParams */

    it('should call the callback immediately', () => {
        const [, watchParams] = useSearchParams({ page: 1 });
        const callback = vi.fn();
        track(watchParams(callback));
        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith({ page: 1 });
    });

    it('should observe changes made with setParams', () => {
        const [setParams, watchParams] = useSearchParams();
        const callback = vi.fn();
        track(watchParams(callback));
        callback.mockClear();
        setParams({ page: 2 });
        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith({ page: '2' });
    });

    it('should observe changes made with history.pushState', () => {
        const [, watchParams] = useSearchParams();
        const callback = vi.fn();
        track(watchParams(callback));
        callback.mockClear();
        history.pushState({}, '', '/?page=2');
        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith({ page: '2' });
    });

    it('should observe changes made with history.replaceState', () => {
        const [, watchParams] = useSearchParams();
        const callback = vi.fn();
        track(watchParams(callback));
        callback.mockClear();
        history.replaceState({}, '', '/?page=2');
        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith({ page: '2' });
    });

    it('should not notify when parameters do not change', () => {
        const [, watchParams] = useSearchParams();
        const callback = vi.fn();
        track(watchParams(callback));
        callback.mockClear();
        history.pushState({}, '', '/');
        expect(callback).not.toHaveBeenCalled();
    });

    it('should reject invalid callbacks', () => {
        const [, watchParams] = useSearchParams();
        expect(() => watchParams(null)).toThrow(TypeError);
        expect(() => watchParams('invalid')).toThrow(TypeError);
    });

    /* Unsubscribe */

    it('should stop observing after unsubscribe', () => {
        const [setParams, watchParams] = useSearchParams();
        const callback = vi.fn();
        const unsubscribe = track(watchParams(callback));
        callback.mockClear();
        unsubscribe();
        setParams({ page: 2 });
        expect(callback).not.toHaveBeenCalled();
    });

    it('should allow repeated unsubscribe calls', () => {
        const [, watchParams] = useSearchParams();
        const unsubscribe = track(watchParams(vi.fn()));
        expect(() => unsubscribe()).not.toThrow();
        expect(() => unsubscribe()).not.toThrow();
    });

    it('should replace the previous watcher', () => {
        const [setParams, watchParams] = useSearchParams();
        const first = vi.fn(), second = vi.fn();
        track(watchParams(first));
        track(watchParams(second));
        first.mockClear();
        second.mockClear();
        setParams({ page: 2 });
        expect(first).not.toHaveBeenCalled();
        expect(second).toHaveBeenCalledOnce();
        expect(second).toHaveBeenCalledWith({ page: '2' });
    });

    it('should expose a third unsubscribe function', () => {
        const [, , unsubscribe] = useSearchParams();
        expect(unsubscribe).toBeTypeOf('function');
    });

    it('should unsubscribe through the third tuple function', () => {
        const [setParams, watchParams, unsubscribe] = useSearchParams();
        const callback = vi.fn();
        track(watchParams(callback));
        callback.mockClear();
        unsubscribe();
        setParams({ page: 2 });
        expect(callback).not.toHaveBeenCalled();
    });

    /* AbortSignal */

    it('should stop observing when the signal is aborted', () => {
        const [setParams, watchParams] = useSearchParams();
        const controller = new AbortController();
        const callback = vi.fn();
        track(watchParams(callback, { signal: controller.signal }));
        callback.mockClear();
        controller.abort();
        setParams({ page: 2 });
        expect(callback).not.toHaveBeenCalled();
    });

    it('should not subscribe when the signal is already aborted', () => {
        const [, watchParams] = useSearchParams();
        const controller = new AbortController();
        const callback = vi.fn();
        controller.abort();
        const unsubscribe = watchParams(callback, { signal: controller.signal });
        expect(callback).not.toHaveBeenCalled();
        expect(unsubscribe).toBeTypeOf('function');
    });

    /* Native browser events */

    it('should observe popstate changes', () => {
        const [, watchParams] = useSearchParams();
        const callback = vi.fn();
        track(watchParams(callback));
        callback.mockClear();
        originalReplaceState.call(history, {}, '', '/?page=2');
        dispatchEvent(new PopStateEvent('popstate'));
        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith({ page: '2' });
    });

    it('should not notify twice for the same parameters', () => {
        const [, watchParams] = useSearchParams();
        const callback = vi.fn();
        track(watchParams(callback));
        callback.mockClear();
        originalReplaceState.call(history, {}, '', '/?page=2');
        dispatchEvent(new PopStateEvent('popstate'));
        dispatchEvent(new PopStateEvent('popstate'));
        expect(callback).toHaveBeenCalledOnce();
    });
});