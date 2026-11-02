import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDocumentVisibility } from "ziko/hooks/document";

describe("useDocumentVisibility", () => {
    beforeEach(() => {
        Object.defineProperty(document, "visibilityState", {
            configurable: true,
            value: "visible"
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const setVisibility = (state) => {
        Object.defineProperty(document, "visibilityState", {
            configurable: true,
            value: state
        });

        document.dispatchEvent(new Event("visibilitychange"));
    };

    /* Initialization */

    it("should return the expected API", () => {
        const result = useDocumentVisibility();

        expect(result).toHaveLength(2);
        expect(typeof result[0]).toBe("function");
        expect(typeof result[1]).toBe("function");

        result[1]();
    });

    /* watch */

    it("should immediately notify with the current visibility state", () => {
        const [watch, unsubscribe] = useDocumentVisibility();
        const callback = vi.fn();

        watch(callback);

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith(true);

        unsubscribe();
    });

    it("should immediately report hidden state", () => {
        setVisibility("hidden");

        const [watch, unsubscribe] = useDocumentVisibility();
        const callback = vi.fn();

        watch(callback);

        expect(callback).toHaveBeenCalledWith(false);

        unsubscribe();
    });

    it("should throw when registering a non-function callback", () => {
        const [watch, unsubscribe] = useDocumentVisibility();

        expect(() => watch()).toThrow(TypeError);
        expect(() => watch(null)).toThrow(TypeError);
        expect(() => watch("callback")).toThrow(TypeError);
        expect(() => watch({})).toThrow(TypeError);

        unsubscribe();
    });

    it("should register the same callback only once", () => {
        const [watch, unsubscribe] = useDocumentVisibility();
        const callback = vi.fn();

        watch(callback);
        watch(callback);

        expect(callback).toHaveBeenCalledTimes(2);

        setVisibility("hidden");

        expect(callback).toHaveBeenCalledTimes(3);

        unsubscribe();
    });

    /* Visibility Changes */

    it("should notify when the document becomes hidden", () => {
        const [watch, unsubscribe] = useDocumentVisibility();
        const callback = vi.fn();

        watch(callback);
        setVisibility("hidden");

        expect(callback).toHaveBeenNthCalledWith(1, true);
        expect(callback).toHaveBeenNthCalledWith(2, false);

        unsubscribe();
    });

    it("should notify when the document becomes visible", () => {
        setVisibility("hidden");

        const [watch, unsubscribe] = useDocumentVisibility();
        const callback = vi.fn();

        watch(callback);
        setVisibility("visible");

        expect(callback).toHaveBeenNthCalledWith(1, false);
        expect(callback).toHaveBeenNthCalledWith(2, true);

        unsubscribe();
    });

    it("should notify multiple listeners", () => {
        const [watch, unsubscribe] = useDocumentVisibility();
        const first = vi.fn();
        const second = vi.fn();

        watch(first);
        watch(second);

        setVisibility("hidden");

        expect(first).toHaveBeenLastCalledWith(false);
        expect(second).toHaveBeenLastCalledWith(false);

        unsubscribe();
    });

    it("should notify listeners on every visibilitychange event", () => {
        const [watch, unsubscribe] = useDocumentVisibility();
        const callback = vi.fn();

        watch(callback);

        setVisibility("hidden");
        setVisibility("visible");
        setVisibility("hidden");

        expect(callback).toHaveBeenCalledTimes(4);

        unsubscribe();
    });

    /* unsubscribe */

    it("should remove all registered callbacks", () => {
        const [watch, unsubscribe] = useDocumentVisibility();
        const first = vi.fn();
        const second = vi.fn();

        watch(first);
        watch(second);

        unsubscribe();

        setVisibility("hidden");

        expect(first).toHaveBeenCalledOnce();
        expect(second).toHaveBeenCalledOnce();
    });

    it("should remove the document visibility listener", () => {
        const removeSpy = vi.spyOn(document, "removeEventListener");
        const [, unsubscribe] = useDocumentVisibility();

        unsubscribe();

        expect(removeSpy).toHaveBeenCalledWith(
            "visibilitychange",
            expect.any(Function)
        );
    });

    it("should be safe to call unsubscribe multiple times", () => {
        const [, unsubscribe] = useDocumentVisibility();

        expect(() => {
            unsubscribe();
            unsubscribe();
        }).not.toThrow();
    });

    it("should work when no callbacks are registered", () => {
        const [, unsubscribe] = useDocumentVisibility();

        expect(() => setVisibility("hidden")).not.toThrow();

        unsubscribe();
    });

    /* Multiple Instances */

    it("should maintain independent subscribers between instances", () => {
        const [watchFirst, unsubscribeFirst] = useDocumentVisibility();
        const [watchSecond, unsubscribeSecond] = useDocumentVisibility();

        const first = vi.fn();
        const second = vi.fn();

        watchFirst(first);
        watchSecond(second);

        setVisibility("hidden");

        expect(first).toHaveBeenLastCalledWith(false);
        expect(second).toHaveBeenLastCalledWith(false);

        unsubscribeFirst();
        unsubscribeSecond();
    });

    it("should unsubscribe only its own instance", () => {
        const [watchFirst, unsubscribeFirst] = useDocumentVisibility();
        const [watchSecond, unsubscribeSecond] = useDocumentVisibility();

        const first = vi.fn();
        const second = vi.fn();

        watchFirst(first);
        watchSecond(second);

        unsubscribeFirst();
        setVisibility("hidden");

        expect(first).toHaveBeenCalledOnce();
        expect(second).toHaveBeenCalledTimes(2);
        expect(second).toHaveBeenLastCalledWith(false);

        unsubscribeSecond();
    });

    it("should allow registering callbacks after unsubscribe", () => {
        const [watch, unsubscribe] = useDocumentVisibility();
        const callback = vi.fn();

        unsubscribe();

        watch(callback);

        expect(callback).toHaveBeenCalledWith(true);

        // The original DOM listener was removed, so no further updates arrive.
        setVisibility("hidden");

        expect(callback).toHaveBeenCalledOnce();
    });
});