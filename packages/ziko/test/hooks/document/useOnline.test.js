import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useOnline } from "ziko/hooks/document";

describe("useOnline", () => {
    beforeEach(() => {
        Object.defineProperty(navigator, "onLine", {
            configurable: true,
            value: true
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const setOnline = (isOnline) => {
        Object.defineProperty(navigator, "onLine", {
            configurable: true,
            value: isOnline
        });

        window.dispatchEvent(
            new Event(isOnline ? "online" : "offline")
        );
    };

    /* Initialization */

    it("should return the expected API", () => {
        const result = useOnline();

        expect(result).toHaveLength(2);
        expect(typeof result[0]).toBe("function");
        expect(typeof result[1]).toBe("function");

        result[1]();
    });

    /* watch */

    it("should immediately report the current online status", () => {
        const [watch, unsubscribe] = useOnline();
        const callback = vi.fn();

        watch(callback);

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(true);

        unsubscribe();
    });

    it("should immediately report offline status", () => {
        Object.defineProperty(navigator, "onLine", {
            configurable: true,
            value: false
        });

        const [watch, unsubscribe] = useOnline();
        const callback = vi.fn();

        watch(callback);

        expect(callback).toHaveBeenCalledWith(false);

        unsubscribe();
    });

    it("should throw when registering a non-function callback", () => {
        const [watch, unsubscribe] = useOnline();

        expect(() => watch()).toThrow(TypeError);
        expect(() => watch(null)).toThrow(TypeError);
        expect(() => watch("callback")).toThrow(TypeError);
        expect(() => watch({})).toThrow(TypeError);

        unsubscribe();
    });

    it("should register the same callback only once", () => {
        const [watch, unsubscribe] = useOnline();
        const callback = vi.fn();

        watch(callback);
        watch(callback);

        expect(callback).toHaveBeenCalledTimes(2);

        setOnline(false);

        expect(callback).toHaveBeenCalledTimes(3);

        unsubscribe();
    });

    /* Online and Offline Events */

    it("should notify when the browser goes offline", () => {
        const [watch, unsubscribe] = useOnline();
        const callback = vi.fn();

        watch(callback);
        setOnline(false);

        expect(callback).toHaveBeenNthCalledWith(1, true);
        expect(callback).toHaveBeenNthCalledWith(2, false);

        unsubscribe();
    });

    it("should notify when the browser goes online", () => {
        Object.defineProperty(navigator, "onLine", {
            configurable: true,
            value: false
        });

        const [watch, unsubscribe] = useOnline();
        const callback = vi.fn();

        watch(callback);
        setOnline(true);

        expect(callback).toHaveBeenNthCalledWith(1, false);
        expect(callback).toHaveBeenNthCalledWith(2, true);

        unsubscribe();
    });

    it("should notify multiple listeners", () => {
        const [watch, unsubscribe] = useOnline();
        const first = vi.fn();
        const second = vi.fn();

        watch(first);
        watch(second);

        setOnline(false);

        expect(first).toHaveBeenLastCalledWith(false);
        expect(second).toHaveBeenLastCalledWith(false);

        unsubscribe();
    });

    it("should notify listeners on every online/offline event", () => {
        const [watch, unsubscribe] = useOnline();
        const callback = vi.fn();

        watch(callback);

        setOnline(false);
        setOnline(true);
        setOnline(false);

        expect(callback).toHaveBeenCalledTimes(4);

        unsubscribe();
    });

    /* unsubscribe */

    it("should remove all registered callbacks", () => {
        const [watch, unsubscribe] = useOnline();
        const first = vi.fn();
        const second = vi.fn();

        watch(first);
        watch(second);

        unsubscribe();
        setOnline(false);

        expect(first).toHaveBeenCalledOnce();
        expect(second).toHaveBeenCalledOnce();
    });

    it("should remove online and offline event listeners", () => {
        const removeSpy = vi.spyOn(window, "removeEventListener");
        const [, unsubscribe] = useOnline();

        unsubscribe();

        expect(removeSpy).toHaveBeenCalledWith(
            "online",
            expect.any(Function)
        );

        expect(removeSpy).toHaveBeenCalledWith(
            "offline",
            expect.any(Function)
        );
    });

    it("should be safe to call unsubscribe multiple times", () => {
        const [, unsubscribe] = useOnline();

        expect(() => {
            unsubscribe();
            unsubscribe();
        }).not.toThrow();
    });

    it("should work when no callbacks are registered", () => {
        const [, unsubscribe] = useOnline();

        expect(() => setOnline(false)).not.toThrow();

        unsubscribe();
    });

    /* Multiple Instances */

    it("should maintain independent subscribers between instances", () => {
        const [watchFirst, unsubscribeFirst] = useOnline();
        const [watchSecond, unsubscribeSecond] = useOnline();

        const first = vi.fn();
        const second = vi.fn();

        watchFirst(first);
        watchSecond(second);

        setOnline(false);

        expect(first).toHaveBeenLastCalledWith(false);
        expect(second).toHaveBeenLastCalledWith(false);

        unsubscribeFirst();
        unsubscribeSecond();
    });

    it("should unsubscribe only its own instance", () => {
        const [watchFirst, unsubscribeFirst] = useOnline();
        const [watchSecond, unsubscribeSecond] = useOnline();

        const first = vi.fn();
        const second = vi.fn();

        watchFirst(first);
        watchSecond(second);

        unsubscribeFirst();
        setOnline(false);

        expect(first).toHaveBeenCalledOnce();
        expect(second).toHaveBeenCalledTimes(2);
        expect(second).toHaveBeenLastCalledWith(false);

        unsubscribeSecond();
    });

    it("should not receive updates after unsubscribe", () => {
        const [watch, unsubscribe] = useOnline();
        const callback = vi.fn();

        watch(callback);
        unsubscribe();

        setOnline(false);
        setOnline(true);

        expect(callback).toHaveBeenCalledOnce();
    });
});