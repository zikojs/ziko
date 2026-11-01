import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { timeout } from "ziko/time/timeout";

describe("timeout", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    /* Initialization */

    describe("Initialization", () => {
        it("should return an object", () => {
            const result = timeout(100);

            expect(result).toBeTypeOf("object");
        });

        it("should expose an id, clear function and promise", () => {
            const result = timeout(100);

            expect(result).toHaveProperty("id");
            expect(result.clear).toBeTypeOf("function");
            expect(result.promise).toBeInstanceOf(Promise);
        });

        it("should return a valid timer ID", () => {
            const result = timeout(100);

            expect(result.id).toBeDefined();
        });
    });

    /* Execution */

    describe("Execution", () => {
        it("should execute after the specified delay", () => {
            const fn = vi.fn();

            timeout(100, fn);

            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(100);

            expect(fn).toHaveBeenCalledOnce();
        });

        it("should not execute before the delay", () => {
            const fn = vi.fn();

            timeout(100, fn);

            vi.advanceTimersByTime(50);

            expect(fn).not.toHaveBeenCalled();
        });

        it("should work without a callback", async () => {
            const result = timeout(100);

            vi.advanceTimersByTime(100);

            await expect(result.promise).resolves.toBeUndefined();
        });

        it("should execute the callback only once", () => {
            const fn = vi.fn();

            timeout(100, fn);

            vi.advanceTimersByTime(300);

            expect(fn).toHaveBeenCalledOnce();
        });

        it("should support zero delay", () => {
            const fn = vi.fn();

            timeout(0, fn);

            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(0);

            expect(fn).toHaveBeenCalledOnce();
        });
    });

    /* Promise */

    describe("Promise", () => {
        it("should resolve after the specified delay", async () => {
            const result = timeout(100);

            let resolved = false;

            result.promise.then(() => {
                resolved = true;
            });

            vi.advanceTimersByTime(99);
            await Promise.resolve();

            expect(resolved).toBe(false);

            vi.advanceTimersByTime(1);

            await expect(result.promise).resolves.toBeUndefined();
            expect(resolved).toBe(true);
        });

        it("should resolve after executing the callback", async () => {
            const order = [];

            const result = timeout(100, () => {
                order.push("callback");
            });

            result.promise.then(() => {
                order.push("resolved");
            });

            vi.advanceTimersByTime(100);
            await result.promise;
            await Promise.resolve();

            expect(order).toEqual(["callback", "resolved"]);
        });

        it("should resolve independently for multiple timeouts", async () => {
            const first = timeout(100);
            const second = timeout(200);

            vi.advanceTimersByTime(100);

            await expect(first.promise).resolves.toBeUndefined();

            vi.advanceTimersByTime(100);

            await expect(second.promise).resolves.toBeUndefined();
        });
    });

    /* Clear */

    describe("Clear", () => {
        it("should cancel the scheduled callback", () => {
            const fn = vi.fn();
            const result = timeout(100, fn);

            result.clear();

            vi.advanceTimersByTime(100);

            expect(fn).not.toHaveBeenCalled();
        });

        it("should prevent the promise from resolving when cleared", async () => {
            const result = timeout(100);
            const resolved = vi.fn();

            result.promise.then(resolved);

            result.clear();

            vi.advanceTimersByTime(100);
            await Promise.resolve();

            expect(resolved).not.toHaveBeenCalled();
        });

        it("should not affect other timeout instances", () => {
            const firstFn = vi.fn();
            const secondFn = vi.fn();

            const first = timeout(100, firstFn);
            timeout(100, secondFn);

            first.clear();

            vi.advanceTimersByTime(100);

            expect(firstFn).not.toHaveBeenCalled();
            expect(secondFn).toHaveBeenCalledOnce();
        });

        it("should allow clearing multiple times", () => {
            const fn = vi.fn();
            const result = timeout(100, fn);

            expect(() => {
                result.clear();
                result.clear();
            }).not.toThrow();

            vi.advanceTimersByTime(100);

            expect(fn).not.toHaveBeenCalled();
        });
    });

    /* Independent instances */

    describe("Independent instances", () => {
        it("should maintain independent timers", () => {
            const firstFn = vi.fn();
            const secondFn = vi.fn();

            timeout(100, firstFn);
            timeout(200, secondFn);

            vi.advanceTimersByTime(100);

            expect(firstFn).toHaveBeenCalledOnce();
            expect(secondFn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(100);

            expect(secondFn).toHaveBeenCalledOnce();
        });

        it("should support multiple callbacks with the same delay", () => {
            const firstFn = vi.fn();
            const secondFn = vi.fn();

            timeout(100, firstFn);
            timeout(100, secondFn);

            vi.advanceTimersByTime(100);

            expect(firstFn).toHaveBeenCalledOnce();
            expect(secondFn).toHaveBeenCalledOnce();
        });
    });
});