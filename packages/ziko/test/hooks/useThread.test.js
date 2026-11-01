import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Thread, useThread } from 'ziko/hooks';

// --------------------------------------------------
// Fake Worker
// --------------------------------------------------

class FakeWorker {
    static instances = [];

    constructor(url) {
        this.url = url;
        this.listeners = {};
        this.messages = [];
        this.terminated = false;
        this.autoRespond = true;

        FakeWorker.instances.push(this);
    }

    addEventListener(type, callback) {
        (this.listeners[type] ??= []).push(callback);
    }

    postMessage(message) {
        if (this.terminated) {
            throw new Error('Worker has been terminated');
        }

        this.messages.push(message);

        if (this.autoRespond) {
            this.execute(message);
        }
    }

    async execute(message) {
        const { id, funStr, args } = message;

        try {
            const func = new Function(`return (${funStr})`)();
            const result = await func(...args);

            this.dispatch('message', { id, result });
        } catch (error) {
            this.dispatch('message', {
                id,
                error: error instanceof Error
                    ? error.message
                    : String(error)
            });
        }
    }

    dispatch(type, data = {}) {
        for (const callback of this.listeners[type] ?? []) {
            callback({
                data,
                message: data.message,
                preventDefault: vi.fn()
            });
        }
    }

    terminate() {
        this.terminated = true;
    }
}

// --------------------------------------------------
// Helpers
// --------------------------------------------------

const getWorker = () => FakeWorker.instances.at(-1);

const flushPromises = async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
};

// --------------------------------------------------
// Tests
// --------------------------------------------------

describe('Thread', () => {
    let createObjectURL;
    let revokeObjectURL;

    beforeEach(() => {
        FakeWorker.instances = [];

        createObjectURL = vi.fn(() => 'blob:fake-worker');
        revokeObjectURL = vi.fn();

        vi.stubGlobal('Worker', FakeWorker);

        vi.stubGlobal('URL', {
            ...URL,
            createObjectURL,
            revokeObjectURL
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    // ----------------------------------------------
    // Constructor
    // ----------------------------------------------

    describe('constructor', () => {
        it('should create a Worker', () => {
            new Thread();

            expect(FakeWorker.instances).toHaveLength(1);
        });

        it('should create a Blob URL', () => {
            new Thread();

            expect(createObjectURL).toHaveBeenCalledOnce();
        });

        it('should revoke the Blob URL after creating the Worker', () => {
            new Thread();

            expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake-worker');
        });

        it('should register worker event listeners', () => {
            new Thread();

            const worker = getWorker();

            expect(worker.listeners.message).toHaveLength(1);
            expect(worker.listeners.error).toHaveLength(1);
            expect(worker.listeners.messageerror).toHaveLength(1);
        });
    });

    // ----------------------------------------------
    // call()
    // ----------------------------------------------

    describe('call', () => {
        it('should execute a function in the worker', async () => {
            const callback = vi.fn();

            const thread = new Thread();

            thread.call(
                (a, b) => a + b,
                callback,
                [10, 20]
            );

            await flushPromises();

            expect(callback).toHaveBeenCalledWith(30, undefined);
        });

        it('should pass arguments to the function', async () => {
            const callback = vi.fn();

            new Thread().call(
                (name, age) => ({ name, age }),
                callback,
                ['Zakaria', 20]
            );

            await flushPromises();

            expect(callback).toHaveBeenCalledWith(
                { name: 'Zakaria', age: 20 },
                undefined
            );
        });

        it('should support asynchronous functions', async () => {
            const callback = vi.fn();

            new Thread().call(
                async value => {
                    await Promise.resolve();
                    return value * 2;
                },
                callback,
                [5]
            );

            await flushPromises();

            expect(callback).toHaveBeenCalledWith(10, undefined);
        });

        it('should return the Thread instance', () => {
            const thread = new Thread();

            const result = thread.call(
                value => value,
                vi.fn(),
                [1]
            );

            expect(result).toBe(thread);
        });

        it('should assign a unique ID to each call', () => {
            const thread = new Thread();
            const worker = getWorker();

            thread.call(value => value, vi.fn(), [1]);
            thread.call(value => value, vi.fn(), [2]);

            expect(worker.messages[0].id).toBe(1);
            expect(worker.messages[1].id).toBe(2);
        });

        it('should support multiple concurrent calls', async () => {
            const first = vi.fn();
            const second = vi.fn();

            const thread = new Thread();

            thread.call(value => value + 1, first, [10]);
            thread.call(value => value + 2, second, [10]);

            await flushPromises();

            expect(first).toHaveBeenCalledWith(11, undefined);
            expect(second).toHaveBeenCalledWith(12, undefined);
        });

        it('should handle function errors', async () => {
            const callback = vi.fn();

            new Thread().call(
                () => {
                    throw new Error('Something went wrong');
                },
                callback
            );

            await flushPromises();

            expect(callback).toHaveBeenCalledWith(
                undefined,
                'Something went wrong'
            );
        });

        it('should handle non-Error exceptions', async () => {
            const callback = vi.fn();

            new Thread().call(
                () => {
                    throw 'Custom error';
                },
                callback
            );

            await flushPromises();

            expect(callback).toHaveBeenCalledWith(
                undefined,
                'Custom error'
            );
        });

        it('should reject non-function arguments', () => {
            const thread = new Thread();

            expect(() => thread.call('not a function', vi.fn()))
                .toThrow(TypeError);
        });

        it('should reject non-function callbacks', () => {
            const thread = new Thread();

            expect(() => thread.call(() => 1, null))
                .toThrow(TypeError);
        });

        it('should reject non-array arguments', () => {
            const thread = new Thread();

            expect(() => thread.call(() => 1, vi.fn(), 'invalid'))
                .toThrow(TypeError);
        });

        it('should remove a pending callback if postMessage throws', () => {
            const thread = new Thread();
            const worker = getWorker();

            worker.postMessage = () => {
                throw new Error('Failed to send message');
            };

            expect(() => thread.call(() => 1, vi.fn()))
                .toThrow('Failed to send message');
        });
    });

    // ----------------------------------------------
    // Callback handling
    // ----------------------------------------------

    describe('callbacks', () => {
        it('should execute the callback only once', async () => {
            const callback = vi.fn();

            new Thread().call(value => value, callback, [42]);

            await flushPromises();

            const worker = getWorker();
            const id = worker.messages[0].id;

            // Simulate a duplicate response.
            worker.dispatch('message', { id, result: 42 });

            expect(callback).toHaveBeenCalledOnce();
        });

        it('should ignore responses with unknown IDs', () => {
            const callback = vi.fn();

            const thread = new Thread();

            thread.call(value => value, callback, [1]);

            getWorker().dispatch('message', {
                id: 999,
                result: 100
            });

            expect(callback).not.toHaveBeenCalled();
        });

        it('should catch errors thrown by callbacks', async () => {
            const error = new Error('Callback failed');
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

            const callback = () => {
                throw error;
            };

            new Thread().call(value => value, callback, [1]);

            await flushPromises();

            expect(consoleError).toHaveBeenCalledWith(
                'Thread callback error:',
                error
            );
        });
    });

    // ----------------------------------------------
    // terminate()
    // ----------------------------------------------

    describe('terminate', () => {
        it('should terminate the worker', () => {
            const thread = new Thread();
            const worker = getWorker();

            thread.terminate();

            expect(worker.terminated).toBe(true);
        });

        it('should terminate only once', () => {
            const thread = new Thread();
            const worker = getWorker();
            const terminate = vi.spyOn(worker, 'terminate');

            thread.terminate();
            thread.terminate();

            expect(terminate).toHaveBeenCalledOnce();
        });

        it('should notify pending callbacks when terminated', () => {
            const callback = vi.fn();

            const thread = new Thread();
            const worker = getWorker();

            worker.autoRespond = false;

            thread.call(value => value, callback, [1]);

            thread.terminate();

            expect(callback).toHaveBeenCalledWith(
                undefined,
                'Thread terminated before the task completed'
            );
        });

        it('should reject calls after termination', () => {
            const thread = new Thread();

            thread.terminate();

            expect(() => thread.call(() => 1, vi.fn()))
                .toThrow('Thread is closing or has been terminated');
        });
    });

    // ----------------------------------------------
    // close behavior
    // ----------------------------------------------

    describe('close', () => {
        it('should reject new calls when close is requested', () => {
            const thread = new Thread();

            thread.call(() => 1, vi.fn(), [], true);

            expect(() => thread.call(() => 2, vi.fn()))
                .toThrow('Thread is closing or has been terminated');
        });

        it('should terminate after the closing call completes', async () => {
            const thread = new Thread();
            const worker = getWorker();

            thread.call(value => value, vi.fn(), [1], true);

            await flushPromises();

            expect(worker.terminated).toBe(true);
        });

        it('should wait for all pending calls before terminating', () => {
            const thread = new Thread();
            const worker = getWorker();

            worker.autoRespond = false;

            thread.call(value => value, vi.fn(), [1]);
            thread.call(value => value, vi.fn(), [2], true);

            const [first, second] = worker.messages;

            worker.dispatch('message', {
                id: second.id,
                result: 2
            });

            expect(worker.terminated).toBe(false);

            worker.dispatch('message', {
                id: first.id,
                result: 1
            });

            expect(worker.terminated).toBe(true);
        });
    });

    // ----------------------------------------------
    // Worker errors
    // ----------------------------------------------

    describe('worker errors', () => {
        it('should notify all pending callbacks on worker error', () => {
            const first = vi.fn();
            const second = vi.fn();

            const thread = new Thread();
            const worker = getWorker();

            worker.autoRespond = false;

            thread.call(value => value, first, [1]);
            thread.call(value => value, second, [2]);

            worker.dispatch('error', {
                message: 'Worker crashed'
            });

            expect(first).toHaveBeenCalledWith(
                undefined,
                'Worker crashed'
            );

            expect(second).toHaveBeenCalledWith(
                undefined,
                'Worker crashed'
            );

            expect(worker.terminated).toBe(true);
        });

        it('should use a default error message when none is provided', () => {
            const callback = vi.fn();

            const thread = new Thread();
            const worker = getWorker();

            worker.autoRespond = false;

            thread.call(value => value, callback, [1]);

            worker.dispatch('error');

            expect(callback).toHaveBeenCalledWith(
                undefined,
                'Worker execution failed'
            );
        });

        it('should catch callback errors during worker error handling', () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

            const thread = new Thread();
            const worker = getWorker();

            worker.autoRespond = false;

            thread.call(
                value => value,
                () => {
                    throw new Error('Callback failed');
                },
                [1]
            );

            worker.dispatch('error', {
                message: 'Worker crashed'
            });

            expect(consoleError).toHaveBeenCalled();
            expect(worker.terminated).toBe(true);
        });

        it('should handle messageerror events', () => {
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

            new Thread();

            getWorker().dispatch('messageerror');

            expect(consoleError).toHaveBeenCalledWith(
                'Failed to deserialize a worker message'
            );
        });
    });
});

// --------------------------------------------------
// useThread()
// --------------------------------------------------

describe('useThread', () => {
    beforeEach(() => {
        FakeWorker.instances = [];
        vi.stubGlobal('Worker', FakeWorker);
        vi.stubGlobal('URL', {
            ...URL,
            createObjectURL: vi.fn(() => 'blob:fake-worker'),
            revokeObjectURL: vi.fn()
        });
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it('should create a Thread and execute the function', async () => {
        const callback = vi.fn();

        const result = useThread(
            value => value * 2,
            callback,
            [10]
        );

        expect(result).toBeInstanceOf(Thread);

        await flushPromises();

        expect(callback).toHaveBeenCalledWith(20, undefined);
    });

    it('should request closing by default', () => {
        const result = useThread(
            value => value,
            vi.fn(),
            [1]
        );

        expect(() => result.call(() => 2, vi.fn()))
            .toThrow('Thread is closing or has been terminated');
    });

    it('should allow keeping the thread open', async () => {
        const callback = vi.fn();

        const thread = useThread(
            value => value,
            callback,
            [1],
            false
        );

        await flushPromises();

        expect(callback).toHaveBeenCalledWith(1, undefined);

        expect(() => thread.call(() => 2, vi.fn()))
            .not.toThrow();
    });
});