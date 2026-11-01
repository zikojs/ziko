import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sleep } from "ziko/time/sleep";

describe("sleep", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    /* Initialization */

    describe("Initialization", () => {
        it("should return a Promise", () => {
            expect(sleep(100)).toBeInstanceOf(Promise);
        });

        it("should resolve with undefined", async () => {
            const promise = sleep(100);

            vi.advanceTimersByTime(100);

            await expect(promise).resolves.toBeUndefined();
        });
    });

    /* Execution */

    describe("Execution", () => {
        it("should resolve after the specified delay", async () => {
            let resolved = false;

            const promise = sleep(100).then(() => {
                resolved = true;
            });

            vi.advanceTimersByTime(99);
            await Promise.resolve();

            expect(resolved).toBe(false);

            vi.advanceTimersByTime(1);
            await promise;

            expect(resolved).toBe(true);
        });

        it("should not resolve before the delay", async () => {
            let resolved = false;

            sleep(100).then(() => {
                resolved = true;
            });

            vi.advanceTimersByTime(50);
            await Promise.resolve();

            expect(resolved).toBe(false);
        });

        it("should resolve with zero delay", async () => {
            const promise = sleep(0);

            vi.advanceTimersByTime(0);

            await expect(promise).resolves.toBeUndefined();
        });

        it("should support multiple independent calls", async () => {
            const first = vi.fn();
            const second = vi.fn();

            const firstPromise = sleep(100).then(first);
            const secondPromise = sleep(200).then(second);

            vi.advanceTimersByTime(100);
            await firstPromise;

            expect(first).toHaveBeenCalledOnce();
            expect(second).not.toHaveBeenCalled();

            vi.advanceTimersByTime(100);
            await secondPromise;

            expect(second).toHaveBeenCalledOnce();
        });

        it("should resolve multiple calls with the same delay", async () => {
            const first = vi.fn();
            const second = vi.fn();

            const firstPromise = sleep(100).then(first);
            const secondPromise = sleep(100).then(second);

            vi.advanceTimersByTime(100);

            await Promise.all([firstPromise, secondPromise]);

            expect(first).toHaveBeenCalledOnce();
            expect(second).toHaveBeenCalledOnce();
        });
    });
});