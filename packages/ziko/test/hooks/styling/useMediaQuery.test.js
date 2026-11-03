import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MediaQuery, useMediaQuery } from 'ziko/hooks/styling';

describe('MediaQuery', () => {
    let mediaQueries;

    const mockMediaQuery = (query, matches = false) => {
        const listeners = new Set();

        const media = {
            media: query,
            matches,
            addEventListener: vi.fn((event, callback) => {
                if (event === 'change') listeners.add(callback);
            }),
            removeEventListener: vi.fn((event, callback) => {
                if (event === 'change') listeners.delete(callback);
            }),
            dispatch(matches) {
                this.matches = matches;
                listeners.forEach(callback => callback({ matches }));
            }
        };

        mediaQueries.set(query, media);
        return media;
    };

    beforeEach(() => {
        mediaQueries = new Map();
        vi.stubGlobal('matchMedia', vi.fn(query => mediaQueries.get(query) ?? mockMediaQuery(query)));
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    /* Initialization */
    it('should initialize with an empty rules array', () => {
        const fallback = vi.fn();
        const instance = new MediaQuery([], fallback);

        expect(instance.current).toBeNull();
        expect(instance.matches).toBe(false);
        expect(fallback).toHaveBeenCalledOnce();

        instance.destroy();
    });

    it('should execute the callback of the initially matching rule', () => {
        const callback = vi.fn();
        mockMediaQuery('(min-width: 600px)', true);

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback }
        ]);

        expect(callback).toHaveBeenCalledOnce();
        expect(instance.current).toBe('(min-width: 600px)');
        expect(instance.matches).toBe(true);

        instance.destroy();
    });

    it('should execute fallback when no rule matches', () => {
        const fallback = vi.fn();
        mockMediaQuery('(min-width: 600px)', false);

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback: vi.fn() }
        ], fallback);

        expect(fallback).toHaveBeenCalledOnce();
        expect(instance.current).toBeNull();
        expect(instance.matches).toBe(false);

        instance.destroy();
    });

    it('should select the first matching rule', () => {
        const first = vi.fn();
        const second = vi.fn();

        mockMediaQuery('(min-width: 600px)', true);
        mockMediaQuery('(max-width: 300px)', true);

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback: first },
            { query: '(max-width: 300px)', callback: second }
        ]);

        expect(first).toHaveBeenCalledOnce();
        expect(second).not.toHaveBeenCalled();
        expect(instance.current).toBe('(min-width: 600px)');

        instance.destroy();
    });

    /* Validation */
    it('should reject non-array rules', () => {
        expect(() => new MediaQuery({})).toThrow('rules must be an array');
    });

    it('should reject an invalid fallback', () => {
        expect(() => new MediaQuery([], null)).toThrow('fallback must be a function');
    });

    it('should reject an invalid media query', () => {
        expect(() => new MediaQuery([
            { query: '', callback: vi.fn() }
        ])).toThrow('Invalid media query');
    });

    it('should reject a non-string media query', () => {
        expect(() => new MediaQuery([
            { query: 123, callback: vi.fn() }
        ])).toThrow('Invalid media query');
    });

    it('should reject an invalid rule callback', () => {
        expect(() => new MediaQuery([
            { query: '(min-width: 600px)', callback: null }
        ])).toThrow('Invalid callback for: (min-width: 600px)');
    });

    /* Media changes */
    it('should execute a rule callback when its query starts matching', () => {
        const callback = vi.fn();
        const media = mockMediaQuery('(min-width: 600px)');

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback }
        ]);

        media.dispatch(true);

        expect(callback).toHaveBeenCalledOnce();
        expect(instance.current).toBe('(min-width: 600px)');

        instance.destroy();
    });

    it('should execute fallback when no rule matches anymore', () => {
        const callback = vi.fn();
        const fallback = vi.fn();
        const media = mockMediaQuery('(min-width: 600px)', true);

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback }
        ], fallback);

        media.dispatch(false);

        expect(fallback).toHaveBeenCalledOnce();
        expect(instance.current).toBeNull();
        expect(instance.matches).toBe(false);

        instance.destroy();
    });

    it('should not execute callbacks when the active rule does not change', () => {
        const callback = vi.fn();
        const media = mockMediaQuery('(min-width: 600px)', true);

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback }
        ]);

        media.dispatch(true);
        media.dispatch(true);

        expect(callback).toHaveBeenCalledOnce();

        instance.destroy();
    });

    it('should switch between matching rules', () => {
        const first = vi.fn();
        const second = vi.fn();

        const firstMedia = mockMediaQuery('(min-width: 600px)', true);
        const secondMedia = mockMediaQuery('(max-width: 300px)', false);

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback: first },
            { query: '(max-width: 300px)', callback: second }
        ]);

        firstMedia.dispatch(false);
        secondMedia.dispatch(true);

        expect(first).toHaveBeenCalledOnce();
        expect(second).toHaveBeenCalledOnce();
        expect(instance.current).toBe('(max-width: 300px)');

        instance.destroy();
    });

    /* onChange */
    it('should notify listeners when the active rule changes', () => {
        const callback = vi.fn();
        const media = mockMediaQuery('(min-width: 600px)');

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback: vi.fn() }
        ]);

        instance.onChange(callback);
        media.dispatch(true);

        expect(callback).toHaveBeenCalledOnce();
        expect(callback.mock.calls[0][0].query).toBe('(min-width: 600px)');
        expect(callback.mock.calls[0][1]).toBeNull();

        instance.destroy();
    });

    it('should provide the previous rule to listeners', () => {
        const firstMedia = mockMediaQuery('(min-width: 600px)', true);
        const secondMedia = mockMediaQuery('(max-width: 300px)');

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback: vi.fn() },
            { query: '(max-width: 300px)', callback: vi.fn() }
        ]);

        const listener = vi.fn();
        instance.onChange(listener);

        firstMedia.matches = false;
        secondMedia.matches = true;
        instance.update();

        expect(listener).toHaveBeenCalledOnce();
        expect(listener.mock.calls[0][0].query).toBe('(max-width: 300px)');
        expect(listener.mock.calls[0][1].query).toBe('(min-width: 600px)');

        instance.destroy();
    });

    it('should reject an invalid onChange callback', () => {
        const instance = new MediaQuery([]);

        expect(() => instance.onChange(null)).toThrow('callback must be a function');

        instance.destroy();
    });

    it('should unsubscribe an onChange listener', () => {
        const media = mockMediaQuery('(min-width: 600px)');
        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback: vi.fn() }
        ]);

        const listener = vi.fn();
        const stop = instance.onChange(listener);

        stop();
        media.dispatch(true);

        expect(listener).not.toHaveBeenCalled();

        instance.destroy();
    });

    /* Update */
    it('should manually update the active rule', () => {
        const callback = vi.fn();
        const media = mockMediaQuery('(min-width: 600px)');

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback }
        ]);

        media.matches = true;

        expect(instance.update()).toBe(instance);
        expect(callback).toHaveBeenCalledOnce();

        instance.destroy();
    });

    /* Destroy */
    it('should remove all media query listeners on destroy', () => {
        const media = mockMediaQuery('(min-width: 600px)');
        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback: vi.fn() }
        ]);

        instance.destroy();

        expect(media.removeEventListener).toHaveBeenCalledWith(
            'change',
            expect.any(Function)
        );
    });

    it('should clear the active rule on destroy', () => {
        mockMediaQuery('(min-width: 600px)', true);

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback: vi.fn() }
        ]);

        instance.destroy();

        expect(instance.current).toBeNull();
        expect(instance.matches).toBe(false);
    });

    it('should ignore updates after destroy', () => {
        const callback = vi.fn();
        const media = mockMediaQuery('(min-width: 600px)');

        const instance = new MediaQuery([
            { query: '(min-width: 600px)', callback }
        ]);

        instance.destroy();
        media.dispatch(true);
        instance.update();

        expect(callback).not.toHaveBeenCalled();
    });

    it('should allow repeated destroy calls', () => {
        const instance = new MediaQuery([]);

        expect(() => {
            instance.destroy();
            instance.destroy();
        }).not.toThrow();
    });

    /* useMediaQuery */
    it('should return a MediaQuery instance', () => {
        const instance = useMediaQuery([]);

        expect(instance).toBeInstanceOf(MediaQuery);

        instance.destroy();
    });
});