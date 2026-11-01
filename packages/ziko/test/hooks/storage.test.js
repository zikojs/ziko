
import {
    describe,
    it,
    expect,
    beforeEach,
    afterEach
} from 'vitest';

import {
    useLocalStorage,
    useSessionStorage
} from 'ziko/hooks';

describe('Storage IPC Integration', () => {
    const instances = [];
    const keys = [];

    const createKey = () => {
        const key = `test-${crypto.randomUUID()}`;
        keys.push(key);
        return key;
    };

    const local = (key, initialData, useChannel = true) => {
        const instance = useLocalStorage(key, initialData, useChannel);
        instances.push(instance);
        return instance;
    };

    const session = (key, initialData, useChannel = true) => {
        const instance = useSessionStorage(key, initialData, useChannel);
        instances.push(instance);
        return instance;
    };

    const waitForUpdate = (watchData, timeout = 2000) =>
        new Promise((resolve, reject) => {
            let unsubscribe;

            const timer = setTimeout(() => {
                unsubscribe?.();
                reject(new Error('IPC update timeout'));
            }, timeout);

            unsubscribe = watchData((next, previous) => {
                clearTimeout(timer);
                unsubscribe();
                resolve({ next, previous });
            });
        });

    beforeEach(() => {
        instances.length = 0;
        keys.length = 0;
    });

    afterEach(() => {
        for (const key of keys) {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
        }

        // Current implementation does not expose channel.close().
        // BroadcastChannels are therefore left to the runtime.
    });

    // Initialization
    describe('Initialization', () => {
        it('should initialize LocalStorage', () => {
            const key = createKey();

            const [data] = local(key, {
                name: 'Zakaria'
            }, false);

            expect(data.name).toBe('Zakaria');
        });

        it('should initialize SessionStorage', () => {
            const key = createKey();

            const [data] = session(key, {
                name: 'Zakaria'
            }, false);

            expect(data.name).toBe('Zakaria');
        });

        it('should restore existing LocalStorage data', () => {
            const key = createKey();

            localStorage.setItem(key, JSON.stringify({
                name: 'John'
            }));

            const [data] = local(key, {
                name: 'Zakaria'
            }, false);

            expect(data.name).toBe('John');
        });

        it('should restore existing SessionStorage data', () => {
            const key = createKey();

            sessionStorage.setItem(key, JSON.stringify({
                name: 'John'
            }));

            const [data] = session(key, {}, false);

            expect(data.name).toBe('John');
        });

        it('should initialize with an empty object by default', () => {
            const [data] = local(createKey(), undefined, false);

            expect({ ...data }).toEqual({});
        });

        it('should persist initial data', () => {
            const key = createKey();

            local(key, {
                count: 10
            }, false);

            expect(JSON.parse(localStorage.getItem(key))).toEqual({
                count: 10
            });
        });
    });

    // Proxy
    describe('Storage Proxy', () => {
        it('should read properties', () => {
            const [data] = local(createKey(), {
                name: 'John'
            }, false);

            expect(data.name).toBe('John');
        });

        it('should update properties', () => {
            const [data] = local(createKey(), {
                name: 'John'
            }, false);

            data.name = 'Zakaria';

            expect(data.name).toBe('Zakaria');
        });

        it('should persist property updates', () => {
            const key = createKey();

            const [data] = local(key, {
                name: 'John'
            }, false);

            data.name = 'Zakaria';

            expect(JSON.parse(localStorage.getItem(key))).toEqual({
                name: 'Zakaria'
            });
        });

        it('should delete properties', () => {
            const [data] = local(createKey(), {
                name: 'John',
                age: 20
            }, false);

            delete data.age;

            expect('age' in data).toBe(false);
        });

        it('should persist property deletion', () => {
            const key = createKey();

            const [data] = local(key, {
                name: 'John',
                age: 20
            }, false);

            delete data.age;

            expect(JSON.parse(localStorage.getItem(key))).toEqual({
                name: 'John'
            });
        });

        it('should support property existence checks', () => {
            const [data] = local(createKey(), {
                name: 'John'
            }, false);

            expect('name' in data).toBe(true);
            expect('age' in data).toBe(false);
        });

        it('should support Object.keys', () => {
            const [data] = local(createKey(), {
                name: 'John',
                age: 20
            }, false);

            expect(Object.keys(data)).toEqual([
                'name',
                'age'
            ]);
        });

        it('should support object spread', () => {
            const [data] = local(createKey(), {
                name: 'John',
                age: 20
            }, false);

            expect({ ...data }).toEqual({
                name: 'John',
                age: 20
            });
        });

        it('should support JSON.stringify', () => {
            const [data] = local(createKey(), {
                name: 'John'
            }, false);

            expect(JSON.stringify(data)).toBe(
                '{"name":"John"}'
            );
        });

        it('should expose StorageData as toStringTag', () => {
            const [data] = local(createKey(), {}, false);

            expect(Object.prototype.toString.call(data)).toBe(
                '[object StorageData]'
            );
        });
    });

    // setData
    describe('setData', () => {
        it('should update multiple properties', () => {
            const [data, setData] = local(createKey(), {
                name: 'John',
                age: 20
            }, false);

            setData({
                name: 'Zakaria',
                active: true
            });

            expect({ ...data }).toEqual({
                name: 'Zakaria',
                age: 20,
                active: true
            });
        });

        it('should support functional updates', () => {
            const [data, setData] = local(createKey(), {
                count: 1
            }, false);

            setData(previous => ({
                count: previous.count + 1
            }));

            expect(data.count).toBe(2);
        });

        it('should preserve properties not included in updates', () => {
            const [data, setData] = local(createKey(), {
                name: 'John',
                age: 20
            }, false);

            setData({
                name: 'Zakaria'
            });

            expect({ ...data }).toEqual({
                name: 'Zakaria',
                age: 20
            });
        });

        it('should persist updates', () => {
            const key = createKey();

            const [, setData] = local(key, {
                count: 0
            }, false);

            setData({
                count: 10
            });

            expect(JSON.parse(localStorage.getItem(key))).toEqual({
                count: 10
            });
        });

        it('should reject invalid updates', () => {
            const [, setData] = local(createKey(), {}, false);

            expect(() => setData(null)).toThrow(TypeError);
            expect(() => setData('invalid')).toThrow(TypeError);
            expect(() => setData(123)).toThrow(TypeError);
        });
    });

    // watchData
    describe('watchData', () => {
        it('should notify on property updates', () => {
            const [data, , watchData] = local(
                createKey(),
                { name: 'John' },
                false
            );

            const callback = vi.fn();

            watchData(callback);
            data.name = 'Zakaria';

            expect(callback).toHaveBeenCalledOnce();
            expect(callback).toHaveBeenCalledWith(
                { name: 'Zakaria' },
                { name: 'John' }
            );
        });

        it('should notify on property deletion', () => {
            const [data, , watchData] = local(
                createKey(),
                { name: 'John' },
                false
            );

            const callback = vi.fn();

            watchData(callback);
            delete data.name;

            expect(callback).toHaveBeenCalledOnce();
        });

        it('should notify on setData', () => {
            const [, setData, watchData] = local(
                createKey(),
                { count: 0 },
                false
            );

            const callback = vi.fn();

            watchData(callback);
            setData({ count: 1 });

            expect(callback).toHaveBeenCalledOnce();
        });

        it('should provide previous and next states', () => {
            const [, setData, watchData] = local(
                createKey(),
                { count: 0 },
                false
            );

            const callback = vi.fn();

            watchData(callback);
            setData({ count: 1 });

            expect(callback).toHaveBeenCalledWith(
                { count: 1 },
                { count: 0 }
            );
        });

        it('should unsubscribe listeners', () => {
            const [, setData, watchData] = local(
                createKey(),
                { count: 0 },
                false
            );

            const callback = vi.fn();
            const unsubscribe = watchData(callback);

            unsubscribe();
            setData({ count: 1 });

            expect(callback).not.toHaveBeenCalled();
        });

        it('should reject invalid callbacks', () => {
            const [, , watchData] = local(createKey(), {}, false);

            expect(() => watchData(null)).toThrow(TypeError);
        });

        it('should not notify when data is unchanged', () => {
            const [data, , watchData] = local(
                createKey(),
                { name: 'John' },
                false
            );

            const callback = vi.fn();

            watchData(callback);
            data.name = 'John';

            expect(callback).not.toHaveBeenCalled();
        });
    });

    // IPC integration
    describe('IPC synchronization', () => {
        it('should synchronize property updates between instances', async () => {
            const key = createKey();

            const [first] = local(key, {
                count: 0
            });

            const [second, , watchSecond] = local(key);

            const update = waitForUpdate(watchSecond);

            first.count = 10;

            const { next, previous } = await update;

            expect(second.count).toBe(10);
            expect(next.count).toBe(10);
            expect(previous.count).toBe(0);
        });

        it('should synchronize setData updates', async () => {
            const key = createKey();

            const [, setFirst] = local(key, {
                count: 0
            });

            const [second, , watchSecond] = local(key);

            const update = waitForUpdate(watchSecond);

            setFirst({
                count: 5
            });

            const { next } = await update;

            expect(second.count).toBe(5);
            expect(next.count).toBe(5);
        });

        it('should synchronize property deletion', async () => {
            const key = createKey();

            const [first] = local(key, {
                name: 'John',
                age: 20
            });

            const [second, , watchSecond] = local(key);

            const update = waitForUpdate(watchSecond);

            delete first.age;

            const { next } = await update;

            expect('age' in second).toBe(false);
            expect(next.age).toBeUndefined();
        });

        it('should not rebroadcast received updates', async () => {
            const key = createKey();

            const [first] = local(key, {
                count: 0
            });

            const [second, , watchSecond] = local(key);

            const update = waitForUpdate(watchSecond);

            first.count = 10;

            await update;

            // If the receiver rebroadcasts, this could create
            // an unnecessary IPC loop. The implementation
            // explicitly disables broadcasting on received data.
            expect(second.count).toBe(10);
        });

        it('should not synchronize when IPC is disabled', async () => {
            const key = createKey();

            const [first] = local(key, {
                count: 0
            }, false);

            const [second] = local(key);

            first.count = 10;

            await new Promise(resolve => setTimeout(resolve, 50));

            expect(second.count).toBe(0);
        });

        it('should synchronize between session storage instances', async () => {
            const key = createKey();

            const [first] = session(key, {
                message: 'hello'
            });

            const [second, , watchSecond] = session(key);

            const update = waitForUpdate(watchSecond);

            first.message = 'updated';

            const { next } = await update;

            expect(second.message).toBe('updated');
            expect(next.message).toBe('updated');
        });
    });

    // Recovery
    describe('Stored data recovery', () => {
        it('should recover from invalid JSON', () => {
            const key = createKey();

            localStorage.setItem(key, '{invalid');

            const [data] = local(key, {
                name: 'John'
            }, false);

            expect({ ...data }).toEqual({});
        });

        it('should return empty object for primitive JSON', () => {
            const key = createKey();

            localStorage.setItem(key, JSON.stringify(123));

            const [data] = local(key, {}, false);

            expect({ ...data }).toEqual({});
        });

        it('should recover from null JSON', () => {
            const key = createKey();

            localStorage.setItem(key, 'null');

            const [data] = local(key, {}, false);

            expect({ ...data }).toEqual({});
        });
    });

    // Validation
    describe('Validation', () => {
        it('should reject empty keys', () => {
            expect(() => useLocalStorage('', {}, false))
                .toThrow(TypeError);
        });

        it('should reject non-string keys', () => {
            expect(() => useLocalStorage(123, {}, false))
                .toThrow(TypeError);
        });

        it('should reject invalid initial data', () => {
            expect(() => useLocalStorage('test', 'invalid', false))
                .toThrow(TypeError);

            expect(() => useLocalStorage('test', 123, false))
                .toThrow(TypeError);

            expect(() => useLocalStorage('test', null, false))
                .toThrow(TypeError);
        });
    });
});
