
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from 'vitest';

import { EventEmitter, useEventEmitter } from 'ziko/hooks';

describe('EventEmitter', () => {
    let emitter;

    beforeEach(() => {
        emitter = new EventEmitter();
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    // Constructor
    describe('constructor', () => {
        it('should initialize with default max listeners', () => {
            expect(emitter.maxListeners).toBe(10);
            expect(emitter.events).toBeInstanceOf(Map);
        });

        it('should accept a custom max listeners value', () => {
            const instance = new EventEmitter(5);
            expect(instance.maxListeners).toBe(5);
        });

        it('should reject an invalid max listeners value', () => {
            expect(() => new EventEmitter(-1)).toThrow(RangeError);
            expect(() => new EventEmitter(1.5)).toThrow(RangeError);
        });
    });

    // on
    describe('on', () => {
        it('should register a listener', () => {
            const callback = vi.fn();

            emitter.on('test', callback);

            expect(emitter.listenerCount('test')).toBe(1);
        });

        it('should call the listener when emitting', () => {
            const callback = vi.fn();

            emitter.on('test', callback);
            emitter.emit('test', 'hello');

            expect(callback).toHaveBeenCalledWith('hello');
        });

        it('should support multiple listeners', () => {
            const first = vi.fn();
            const second = vi.fn();

            emitter.on('test', first);
            emitter.on('test', second);
            emitter.emit('test');

            expect(first).toHaveBeenCalledOnce();
            expect(second).toHaveBeenCalledOnce();
        });

        it('should return the emitter instance', () => {
            expect(emitter.on('test', vi.fn())).toBe(emitter);
        });

        it('should reject non-function listeners', () => {
            expect(() => emitter.on('test', null)).toThrow(TypeError);
            expect(() => emitter.on('test', 'invalid')).toThrow(TypeError);
        });

        it('should reject invalid signals', () => {
            expect(() => emitter.on('test', vi.fn(), {
                signal: {}
            })).toThrow(TypeError);
        });

        it('should not register an already aborted signal', () => {
            const controller = new AbortController();

            controller.abort();

            emitter.on('test', vi.fn(), {
                signal: controller.signal
            });

            expect(emitter.listenerCount('test')).toBe(0);
        });

        it('should remove listener when signal is aborted', () => {
            const controller = new AbortController();
            const callback = vi.fn();

            emitter.on('test', callback, {
                signal: controller.signal
            });

            controller.abort();
            emitter.emit('test');

            expect(callback).not.toHaveBeenCalled();
            expect(emitter.listenerCount('test')).toBe(0);
        });
    });

    // once
    describe('once', () => {
        it('should execute listener only once', () => {
            const callback = vi.fn();

            emitter.once('test', callback);

            emitter.emit('test');
            emitter.emit('test');

            expect(callback).toHaveBeenCalledOnce();
        });

        it('should pass emitted arguments', () => {
            const callback = vi.fn();

            emitter.once('test', callback);
            emitter.emit('test', 1, 2, 3);

            expect(callback).toHaveBeenCalledWith(1, 2, 3);
        });

        it('should remove the listener after execution', () => {
            emitter.once('test', vi.fn());

            emitter.emit('test');

            expect(emitter.listenerCount('test')).toBe(0);
        });

        it('should support AbortSignal', () => {
            const controller = new AbortController();
            const callback = vi.fn();

            emitter.once('test', callback, {
                signal: controller.signal
            });

            controller.abort();
            emitter.emit('test');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should reject non-function listeners', () => {
            expect(() => emitter.once('test', null)).toThrow(TypeError);
        });
    });

    // off
    describe('off', () => {
        it('should remove a listener', () => {
            const callback = vi.fn();

            emitter.on('test', callback);
            emitter.off('test', callback);
            emitter.emit('test');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should remove all matching registrations', () => {
            const callback = vi.fn();

            emitter.on('test', callback);
            emitter.on('test', callback);

            emitter.off('test', callback);

            expect(emitter.listenerCount('test')).toBe(0);
        });

        it('should remove once listener using original callback', () => {
            const callback = vi.fn();

            emitter.once('test', callback);
            emitter.off('test', callback);
            emitter.emit('test');

            expect(callback).not.toHaveBeenCalled();
        });

        it('should return the emitter instance', () => {
            expect(emitter.off('test', vi.fn())).toBe(emitter);
        });
    });

    // emit
    describe('emit', () => {
        it('should return true when listeners exist', () => {
            emitter.on('test', vi.fn());

            expect(emitter.emit('test')).toBe(true);
        });

        it('should return false when no listeners exist', () => {
            expect(emitter.emit('unknown')).toBe(false);
        });

        it('should pass multiple arguments', () => {
            const callback = vi.fn();

            emitter.on('test', callback);
            emitter.emit('test', 1, 'hello', { id: 2 });

            expect(callback).toHaveBeenCalledWith(
                1,
                'hello',
                { id: 2 }
            );
        });

        it('should support wildcard listeners', () => {
            const callback = vi.fn();

            emitter.on('*', callback);
            emitter.emit('user:created', 42);

            expect(callback).toHaveBeenCalledWith('user:created', 42);
        });

        it('should not call wildcard listeners twice for wildcard emit', () => {
            const callback = vi.fn();

            emitter.on('*', callback);
            emitter.emit('*', 'hello');

            expect(callback).toHaveBeenCalledOnce();
            expect(callback).toHaveBeenCalledWith('*', 'hello');
        });

        it('should continue when a listener throws', () => {
            const error = new Error('Test error');
            const first = vi.fn(() => {
                throw error;
            });
            const second = vi.fn();

            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            emitter.on('test', first);
            emitter.on('test', second);

            emitter.emit('test');

            expect(consoleSpy).toHaveBeenCalled();
            expect(second).toHaveBeenCalledOnce();
        });

        it('should skip listeners removed during emission', () => {
            const second = vi.fn();

            emitter.on('test', () => {
                emitter.off('test', second);
            });

            emitter.on('test', second);
            emitter.emit('test');

            expect(second).not.toHaveBeenCalled();
        });

        it('should handle listeners removed by aborting their signal during emission', () => {
            const controller = new AbortController();
            const second = vi.fn();

            emitter.on('test', () => controller.abort());

            emitter.on('test', second, {
                signal: controller.signal
            });

            emitter.emit('test');

            expect(second).not.toHaveBeenCalled();
        });
    });

    // waitFor
    describe('waitFor', () => {
        it('should resolve when event is emitted', async () => {
            const promise = emitter.waitFor('test');

            emitter.emit('test', 'hello');

            await expect(promise).resolves.toBe('hello');
        });

        it('should resolve with undefined when no arguments are emitted', async () => {
            const promise = emitter.waitFor('test');

            emitter.emit('test');

            await expect(promise).resolves.toBeUndefined();
        });

        it('should resolve with an array for multiple arguments', async () => {
            const promise = emitter.waitFor('test');

            emitter.emit('test', 1, 2, 3);

            await expect(promise).resolves.toEqual([1, 2, 3]);
        });

        it('should remove listener after resolving', async () => {
            const promise = emitter.waitFor('test');

            emitter.emit('test');

            await promise;

            expect(emitter.listenerCount('test')).toBe(0);
        });

        it('should reject when signal is already aborted', async () => {
            const controller = new AbortController();
            controller.abort();

            await expect(
                emitter.waitFor('test', {
                    signal: controller.signal
                })
            ).rejects.toMatchObject({
                name: 'AbortError'
            });
        });

        it('should reject when signal is aborted', async () => {
            const controller = new AbortController();

            const promise = emitter.waitFor('test', {
                signal: controller.signal
            });

            controller.abort();

            await expect(promise).rejects.toMatchObject({
                name: 'AbortError'
            });

            expect(emitter.listenerCount('test')).toBe(0);
        });

        it('should reject with the signal reason', async () => {
            const controller = new AbortController();
            const reason = new Error('Cancelled');

            const promise = emitter.waitFor('test', {
                signal: controller.signal
            });

            controller.abort(reason);

            await expect(promise).rejects.toBe(reason);
        });

        it('should reject after timeout', async () => {
            vi.useFakeTimers();

            const promise = emitter.waitFor('test', {
                timeout: 1000
            });

            const assertion = expect(promise).rejects.toMatchObject({
                name: 'TimeoutError'
            });

            await vi.advanceTimersByTimeAsync(1000);

            await assertion;

            expect(emitter.listenerCount('test')).toBe(0);
        });

        it('should reject invalid timeout values', async () => {
            await expect(
                emitter.waitFor('test', { timeout: -1 })
            ).rejects.toThrow(RangeError);

            await expect(
                emitter.waitFor('test', { timeout: Infinity })
            ).rejects.toThrow(RangeError);
        });

        it('should clear timeout after resolving', async () => {
            vi.useFakeTimers();

            const promise = emitter.waitFor('test', {
                timeout: 1000
            });

            emitter.emit('test', 'done');

            await expect(promise).resolves.toBe('done');

            expect(vi.getTimerCount()).toBe(0);
        });
    });

    // remove
    describe('remove', () => {
        it('should remove all listeners for an event', () => {
            emitter.on('test', vi.fn());
            emitter.on('test', vi.fn());

            emitter.remove('test');

            expect(emitter.listenerCount('test')).toBe(0);
        });

        it('should return the emitter instance', () => {
            expect(emitter.remove('test')).toBe(emitter);
        });
    });

    // removeAllListeners
    describe('removeAllListeners', () => {
        it('should remove listeners for all events', () => {
            emitter.on('first', vi.fn());
            emitter.on('second', vi.fn());

            emitter.removeAllListeners();

            expect(emitter.eventNames()).toEqual([]);
        });

        it('should remove listeners for a specific event', () => {
            emitter.on('first', vi.fn());
            emitter.on('second', vi.fn());

            emitter.removeAllListeners('first');

            expect(emitter.listenerCount('first')).toBe(0);
            expect(emitter.listenerCount('second')).toBe(1);
        });

        it('should return the emitter instance', () => {
            expect(emitter.removeAllListeners()).toBe(emitter);
        });
    });

    // listenerCount
    describe('listenerCount', () => {
        it('should return the number of listeners', () => {
            emitter.on('test', vi.fn());
            emitter.on('test', vi.fn());

            expect(emitter.listenerCount('test')).toBe(2);
        });

        it('should return zero for unknown events', () => {
            expect(emitter.listenerCount('unknown')).toBe(0);
        });
    });

    // eventNames
    describe('eventNames', () => {
        it('should return registered event names', () => {
            emitter.on('first', vi.fn());
            emitter.on('second', vi.fn());

            expect(emitter.eventNames()).toEqual([
                'first',
                'second'
            ]);
        });

        it('should remove event name after last listener is removed', () => {
            emitter.on('test', vi.fn());
            emitter.remove('test');

            expect(emitter.eventNames()).toEqual([]);
        });
    });

    // clear
    describe('clear', () => {
        it('should remove all listeners', () => {
            emitter.on('first', vi.fn());
            emitter.on('second', vi.fn());

            emitter.clear();

            expect(emitter.eventNames()).toEqual([]);
        });

        it('should return the emitter instance', () => {
            expect(emitter.clear()).toBe(emitter);
        });
    });

    // setMaxListeners
    describe('setMaxListeners', () => {
        it('should update max listeners', () => {
            expect(emitter.setMaxListeners(5)).toBe(emitter);
            expect(emitter.maxListeners).toBe(5);
        });

        it('should disable warnings with zero', () => {
            emitter.setMaxListeners(0);

            const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});

            for (let i = 0; i < 20; i++) {
                emitter.on('test', vi.fn());
            }

            expect(warning).not.toHaveBeenCalled();
        });

        it('should warn when max listeners is exceeded', () => {
            emitter.setMaxListeners(1);

            const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});

            emitter.on('test', vi.fn());
            emitter.on('test', vi.fn());

            expect(warning).toHaveBeenCalledOnce();
        });

        it('should reject invalid values', () => {
            expect(() => emitter.setMaxListeners(-1)).toThrow(RangeError);
            expect(() => emitter.setMaxListeners(1.5)).toThrow(RangeError);
            expect(() => emitter.setMaxListeners(NaN)).toThrow(RangeError);
        });
    });
});

// useEventEmitter
describe('useEventEmitter', () => {
    it('should return an EventEmitter instance', () => {
        expect(useEventEmitter()).toBeInstanceOf(EventEmitter);
    });

    it('should accept custom max listeners', () => {
        const emitter = useEventEmitter(5);

        expect(emitter.maxListeners).toBe(5);
    });
});
