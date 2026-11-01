import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from 'vitest';

import { useHash } from 'ziko/hooks/routing';

const EVENT = 'ziko:hashchange';
const PATCHED = Symbol.for('ziko/hash/patched');

describe('useHash', () => {
    beforeEach(() => {
        history.replaceState({}, '', '/');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    /* Initialization */

    describe('initialization', () => {
        it('should initialize the hash with a string', () => {
            useHash('home');

            expect(location.hash).toBe('#home');
        });

        it('should remove the leading # from the initial value', () => {
            useHash('#home');

            expect(location.hash).toBe('#home');
        });

        it('should not overwrite an existing hash', () => {
            history.replaceState({}, '', '/#about');

            useHash('home');

            expect(location.hash).toBe('#about');
        });

        it('should not initialize an empty hash', () => {
            useHash('');

            expect(location.hash).toBe('');
        });

        it('should not initialize with null', () => {
            useHash(null);

            expect(location.hash).toBe('');
        });

        it('should not initialize with undefined', () => {
            useHash();

            expect(location.hash).toBe('');
        });

        it('should return setHash and watchHash', () => {
            const result = useHash();

            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(Function);
            expect(result[1]).toBeInstanceOf(Function);
        });

        it('should reject non-string initial values', () => {
            expect(() => useHash(123)).toThrow(TypeError);
            expect(() => useHash(true)).toThrow(TypeError);
            expect(() => useHash([])).toThrow(TypeError);
            expect(() => useHash({ page: 'home' })).toThrow(TypeError);
        });
    });

    /* Hash reading */

    describe('hash reading', () => {
        it('should read a plain string hash', () => {
            history.replaceState({}, '', '/#about');

            const [, watchHash] = useHash();
            const callback = vi.fn();

            watchHash(callback);

            expect(callback).toHaveBeenCalledWith('about');
        });

        it('should return an empty string for an empty hash', () => {
            const [, watchHash] = useHash();
            const callback = vi.fn();

            watchHash(callback);

            expect(callback).toHaveBeenCalledWith('');
        });

        it('should preserve special characters', () => {
            const [, watchHash] = useHash();
            const callback = vi.fn();

            watchHash(callback);

            callback.mockClear();

            history.pushState({}, '', '/#hello%20world');

            expect(callback).toHaveBeenCalledWith('hello%20world');
        });
    });

    /* setHash */

    describe('setHash', () => {
        it('should set a string hash', () => {
            const [setHash] = useHash();

            setHash('about');

            expect(location.hash).toBe('#about');
        });

        it('should remove the leading #', () => {
            const [setHash] = useHash();

            setHash('#about');

            expect(location.hash).toBe('#about');
        });

        it('should remove the hash when setting an empty string', () => {
            const [setHash] = useHash('home');

            setHash('');

            expect(location.hash).toBe('');
        });

        it('should remove the hash when setting null', () => {
            const [setHash] = useHash('home');

            setHash(null);

            expect(location.hash).toBe('');
        });

        it('should remove the hash when setting undefined', () => {
            const [setHash] = useHash('home');

            setHash(undefined);

            expect(location.hash).toBe('');
        });

        it('should preserve pathname and search parameters', () => {
            history.replaceState({}, '', '/users?page=2');

            const [setHash] = useHash();

            setHash('profile');

            expect(location.pathname).toBe('/users');
            expect(location.search).toBe('?page=2');
            expect(location.hash).toBe('#profile');
        });

        it('should return the updated hash', () => {
            const [setHash] = useHash();

            expect(setHash('about')).toBe('about');
        });

        it('should return the current hash when unchanged', () => {
            const [setHash] = useHash('home');

            expect(setHash('home')).toBe('home');
        });

        it('should not update history when the hash is unchanged', () => {
            const [setHash] = useHash('home');
            const pushState = vi.spyOn(history, 'pushState');

            setHash('home');

            expect(pushState).not.toHaveBeenCalled();
        });

        it('should support functional updates', () => {
            const [setHash] = useHash('home');

            const result = setHash(current => `${current}-page`);

            expect(result).toBe('home-page');
            expect(location.hash).toBe('#home-page');
        });

        it('should support functional updates from an empty hash', () => {
            const [setHash] = useHash();

            const result = setHash(current => current || 'home');

            expect(result).toBe('home');
            expect(location.hash).toBe('#home');
        });

        it('should reject unsupported values', () => {
            const [setHash] = useHash();

            expect(() => setHash(123)).toThrow(TypeError);
            expect(() => setHash(true)).toThrow(TypeError);
            expect(() => setHash({ page: 'home' })).toThrow(TypeError);
        });

        it('should reject functional updates returning unsupported values', () => {
            const [setHash] = useHash();

            expect(() => setHash(() => 123)).toThrow(TypeError);
        });
    });

    /* watchHash */

    describe('watchHash', () => {
        it('should execute the callback immediately', () => {
            const [, watchHash] = useHash('home');
            const callback = vi.fn();

            watchHash(callback);

            expect(callback).toHaveBeenCalledOnce();
            expect(callback).toHaveBeenCalledWith('home');
        });

        it('should notify when setHash changes the hash', () => {
            const [setHash, watchHash] = useHash('home');
            const callback = vi.fn();

            watchHash(callback);
            callback.mockClear();

            setHash('about');

            expect(callback).toHaveBeenCalledOnce();
            expect(callback).toHaveBeenCalledWith('about');
        });

        it('should notify when pushState changes the hash', () => {
            const [, watchHash] = useHash();
            const callback = vi.fn();

            watchHash(callback);
            callback.mockClear();

            history.pushState({}, '', '/#about');

            expect(callback).toHaveBeenCalledOnce();
            expect(callback).toHaveBeenCalledWith('about');
        });

        it('should notify when replaceState changes the hash', () => {
            const [, watchHash] = useHash();
            const callback = vi.fn();

            watchHash(callback);
            callback.mockClear();

            history.replaceState({}, '', '/#about');

            expect(callback).toHaveBeenCalledOnce();
            expect(callback).toHaveBeenCalledWith('about');
        });

        it('should notify on popstate when the hash changes', () => {
            const [, watchHash] = useHash();
            const callback = vi.fn();

            watchHash(callback);
            callback.mockClear();

            history.replaceState({}, '', '/#about');
            dispatchEvent(new PopStateEvent('popstate'));

            expect(callback).toHaveBeenCalledOnce();
            expect(callback).toHaveBeenCalledWith('about');
        });

        it('should notify on hashchange when the hash changes', () => {
            const [, watchHash] = useHash();
            const callback = vi.fn();

            watchHash(callback);
            callback.mockClear();

            history.replaceState({}, '', '/#about');
            dispatchEvent(new HashChangeEvent('hashchange'));

            expect(callback).toHaveBeenCalledOnce();
            expect(callback).toHaveBeenCalledWith('about');
        });

        it('should not notify when the hash has not changed', () => {
            const [, watchHash] = useHash('home');
            const callback = vi.fn();

            watchHash(callback);
            callback.mockClear();

            dispatchEvent(new Event('popstate'));
            dispatchEvent(new Event('hashchange'));
            dispatchEvent(new Event(EVENT));

            expect(callback).not.toHaveBeenCalled();
        });

        it('should return an unsubscribe function', () => {
            const [setHash, watchHash] = useHash('home');
            const callback = vi.fn();

            const unsubscribe = watchHash(callback);

            expect(unsubscribe).toBeInstanceOf(Function);

            callback.mockClear();
            unsubscribe();

            setHash('about');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should support multiple watchers', () => {
            const [setHash, watchHash] = useHash();
            const first = vi.fn();
            const second = vi.fn();

            watchHash(first);
            watchHash(second);

            first.mockClear();
            second.mockClear();

            setHash('about');

            expect(first).toHaveBeenCalledWith('about');
            expect(second).toHaveBeenCalledWith('about');
        });

        it('should reject non-function callbacks', () => {
            const [, watchHash] = useHash();

            expect(() => watchHash(null)).toThrow(TypeError);
            expect(() => watchHash('invalid')).toThrow(TypeError);
        });
    });

    /* History patching */

    describe('history patching', () => {
        it('should patch history only once', () => {
            const [, watchHash] = useHash();

            watchHash(vi.fn());

            const pushState = history.pushState;
            const replaceState = history.replaceState;

            watchHash(vi.fn());

            expect(history.pushState).toBe(pushState);
            expect(history.replaceState).toBe(replaceState);
            expect(history[PATCHED]).toBe(true);
        });

        it('should not notify when pushState does not change the hash', () => {
            const [, watchHash] = useHash('home');
            const callback = vi.fn();

            watchHash(callback);
            callback.mockClear();

            history.pushState({}, '', '/#home');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should not notify when replaceState does not change the hash', () => {
            const [, watchHash] = useHash('home');
            const callback = vi.fn();

            watchHash(callback);
            callback.mockClear();

            history.replaceState({}, '', '/#home');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should preserve the original pushState return value', () => {
            const [, watchHash] = useHash();

            watchHash(vi.fn());

            expect(history.pushState({}, '', '/#about')).toBeUndefined();
        });

        it('should preserve the original replaceState return value', () => {
            const [, watchHash] = useHash();

            watchHash(vi.fn());

            expect(history.replaceState({}, '', '/#about')).toBeUndefined();
        });
    });
});