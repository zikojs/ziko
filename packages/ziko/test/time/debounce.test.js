import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "ziko/time/debounce";

describe("debounce", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    /* Initialization */

    describe("Initialization", () => {
        it("should return a function", () => {
            const debounced = debounce(vi.fn());

            expect(debounced).toBeTypeOf("function");
        });

        it("should use 1000ms as the default delay", () => {
            const fn = vi.fn();
            const debounced = debounce(fn);

            debounced();

            vi.advanceTimersByTime(999);
            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(1);
            expect(fn).toHaveBeenCalledOnce();
        });

        it("should accept a custom delay", () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 200);

            debounced();

            vi.advanceTimersByTime(199);
            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(1);
            expect(fn).toHaveBeenCalledOnce();
        });
    });

    /* Execution */

    describe("Execution", () => {
        it("should execute after the delay", () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);

            debounced();

            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(100);

            expect(fn).toHaveBeenCalledOnce();
        });

        it("should not execute before the delay", () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);

            debounced();

            vi.advanceTimersByTime(50);

            expect(fn).not.toHaveBeenCalled();
        });

        it("should reset the timer on subsequent calls", () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);

            debounced();

            vi.advanceTimersByTime(50);
            debounced();

            vi.advanceTimersByTime(50);

            expect(fn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(50);

            expect(fn).toHaveBeenCalledOnce();
        });

        it("should execute only once after multiple calls", () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);

            debounced();
            debounced();
            debounced();
            debounced();

            vi.advanceTimersByTime(100);

            expect(fn).toHaveBeenCalledOnce();
        });

        it("should execute again after a previous execution", () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);

            debounced();
            vi.advanceTimersByTime(100);

            debounced();
            vi.advanceTimersByTime(100);

            expect(fn).toHaveBeenCalledTimes(2);
        });
    });

    /* Arguments */

    describe("Arguments", () => {
        it("should pass arguments to the callback", () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);

            debounced("hello", 42);

            vi.advanceTimersByTime(100);

            expect(fn).toHaveBeenCalledWith("hello", 42);
        });

        it("should use the arguments of the last call", () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);

            debounced("first");

            vi.advanceTimersByTime(50);

            debounced("second");

            vi.advanceTimersByTime(100);

            expect(fn).toHaveBeenCalledOnce();
            expect(fn).toHaveBeenCalledWith("second");
        });

        it("should support different argument counts", () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);

            debounced("first");

            vi.advanceTimersByTime(50);

            debounced("second", 42, true);

            vi.advanceTimersByTime(100);

            expect(fn).toHaveBeenCalledOnce();
            expect(fn).toHaveBeenCalledWith("second", 42, true);
        });

        it("should support no arguments", () => {
            const fn = vi.fn();
            const debounced = debounce(fn, 100);

            debounced();

            vi.advanceTimersByTime(100);

            expect(fn).toHaveBeenCalledWith();
        });
    });

    /* Independent instances */

    describe("Independent instances", () => {
        it("should maintain independent timers", () => {
            const firstFn = vi.fn();
            const secondFn = vi.fn();

            const first = debounce(firstFn, 100);
            const second = debounce(secondFn, 100);

            first();
            second();

            vi.advanceTimersByTime(100);

            expect(firstFn).toHaveBeenCalledOnce();
            expect(secondFn).toHaveBeenCalledOnce();
        });

        it("should support different delays", () => {
            const firstFn = vi.fn();
            const secondFn = vi.fn();

            const first = debounce(firstFn, 100);
            const second = debounce(secondFn, 200);

            first();
            second();

            vi.advanceTimersByTime(100);

            expect(firstFn).toHaveBeenCalledOnce();
            expect(secondFn).not.toHaveBeenCalled();

            vi.advanceTimersByTime(100);

            expect(secondFn).toHaveBeenCalledOnce();
        });
    });

    /* Return value */

    describe("Return value", () => {
        it("should return undefined when called", () => {
            const debounced = debounce(vi.fn(), 100);

            expect(debounced()).toBeUndefined();
        });
    });
});