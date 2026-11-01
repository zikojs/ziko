
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from "vitest";

import { throttle } from "ziko/time/throttle";

describe("throttle", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(0);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    /* Initialization */

    describe("Initialization", () => {
        it("should return a function", () => {
            const throttled = throttle(() => {}, 100);

            expect(throttled).toBeTypeOf("function");
        });

        it("should accept a function and a delay", () => {
            const fn = vi.fn();

            expect(() => throttle(fn, 100)).not.toThrow();
        });
    });

    /* Execution */

    describe("Execution", () => {
        it("should execute the function immediately on the first call", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);

            throttled();

            expect(fn).toHaveBeenCalledOnce();
        });

        it("should pass arguments to the original function", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);

            throttled("hello", 42);

            expect(fn).toHaveBeenCalledWith("hello", 42);
        });

        it("should execute again after the delay", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);

            throttled();

            vi.advanceTimersByTime(100);
            throttled();

            expect(fn).toHaveBeenCalledTimes(2);
        });

        it("should ignore calls made before the delay expires", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);

            throttled();

            vi.advanceTimersByTime(50);
            throttled();

            expect(fn).toHaveBeenCalledOnce();
        });

        it("should allow execution exactly at the delay boundary", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);

            throttled();

            vi.advanceTimersByTime(99);
            throttled();

            expect(fn).toHaveBeenCalledOnce();

            vi.advanceTimersByTime(1);
            throttled();

            expect(fn).toHaveBeenCalledTimes(2);
        });

        it("should measure the delay from the last successful execution", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);

            throttled();

            vi.advanceTimersByTime(60);
            throttled();

            vi.advanceTimersByTime(40);
            throttled();

            expect(fn).toHaveBeenCalledTimes(2);
        });

        it("should not execute ignored calls later", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);

            throttled();

            vi.advanceTimersByTime(50);
            throttled();

            vi.advanceTimersByTime(49);

            expect(fn).toHaveBeenCalledOnce();

            vi.advanceTimersByTime(1);

            expect(fn).toHaveBeenCalledOnce();
        });
    });

    /* Arguments */

    describe("Arguments", () => {
        it("should use the arguments of each successful call", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);

            throttled("first");

            vi.advanceTimersByTime(100);
            throttled("second");

            expect(fn).toHaveBeenNthCalledWith(1, "first");
            expect(fn).toHaveBeenNthCalledWith(2, "second");
        });

        it("should support different argument counts", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);

            throttled("first");

            vi.advanceTimersByTime(100);
            throttled("second", 42, true);

            expect(fn).toHaveBeenNthCalledWith(1, "first");
            expect(fn).toHaveBeenNthCalledWith(2, "second", 42, true);
        });
    });

    /* Independent instances */

    describe("Independent instances", () => {
        it("should maintain independent throttle timers", () => {
            const firstFn = vi.fn();
            const secondFn = vi.fn();

            const first = throttle(firstFn, 100);
            const second = throttle(secondFn, 100);

            first();
            vi.advanceTimersByTime(50);

            second();

            expect(firstFn).toHaveBeenCalledOnce();
            expect(secondFn).toHaveBeenCalledOnce();

            vi.advanceTimersByTime(50);

            first();
            second();

            expect(firstFn).toHaveBeenCalledTimes(2);
            expect(secondFn).toHaveBeenCalledOnce();
        });

        it("should support different delays", () => {
            const firstFn = vi.fn();
            const secondFn = vi.fn();

            const first = throttle(firstFn, 100);
            const second = throttle(secondFn, 200);

            first();
            second();

            vi.advanceTimersByTime(100);

            first();
            second();

            expect(firstFn).toHaveBeenCalledTimes(2);
            expect(secondFn).toHaveBeenCalledOnce();
        });
    });

    /* Return value */

    describe("Return value", () => {
        it("should return undefined", () => {
            const fn = vi.fn(() => "result");
            const throttled = throttle(fn, 100);

            expect(throttled()).toBeUndefined();
        });

        it("should return undefined when execution is skipped", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 100);

            throttled();

            expect(throttled()).toBeUndefined();
        });
    });

    /* Delay */

    describe("Delay", () => {
        it("should support a zero delay", () => {
            const fn = vi.fn();
            const throttled = throttle(fn, 0);

            throttled();
            throttled();

            expect(fn).toHaveBeenCalledTimes(2);
        });
    });
});
