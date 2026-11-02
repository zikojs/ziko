import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTitle } from "ziko/hooks";

describe("useTitle", () => {
    beforeEach(() => {
        document.title = "Default Title";
    });

    /* Initialization */

    it("should return the expected API", () => {
        const result = useTitle("ZikoJS");

        expect(result).toHaveLength(3);
        expect(result.every(fn => typeof fn === "function")).toBe(true);
    });

    it("should set the initial document title", () => {
        useTitle("ZikoJS");

        expect(document.title).toBe("ZikoJS");
    });

    it("should use the current document title when no initial title is provided", () => {
        document.title = "Existing Title";

        useTitle();

        expect(document.title).toBe("Existing Title");
    });

    /* setTitle */

    it("should update the document title", () => {
        const [setTitle] = useTitle("Initial Title");

        setTitle("Updated Title");

        expect(document.title).toBe("Updated Title");
    });

    it("should support functional updates", () => {
        const [setTitle] = useTitle("ZikoJS");

        setTitle(current => `${current} Documentation`);

        expect(document.title).toBe("ZikoJS Documentation");
    });

    it("should not notify listeners when the title is unchanged", () => {
        const [setTitle, watchTitle] = useTitle("ZikoJS");
        const callback = vi.fn();

        watchTitle(callback);
        setTitle("ZikoJS");

        expect(callback).not.toHaveBeenCalled();
    });

    /* watchTitle */

    it("should register a listener", () => {
        const [, watchTitle] = useTitle("ZikoJS");
        const callback = vi.fn();

        expect(() => watchTitle(callback)).not.toThrow();
    });

    it("should notify listeners when the title changes", () => {
        const [setTitle, watchTitle] = useTitle("Initial Title");
        const callback = vi.fn();

        watchTitle(callback);
        setTitle("Updated Title");

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith("Updated Title");
    });

    it("should notify multiple listeners", () => {
        const [setTitle, watchTitle] = useTitle("Initial Title");
        const first = vi.fn();
        const second = vi.fn();

        watchTitle(first);
        watchTitle(second);
        setTitle("Updated Title");

        expect(first).toHaveBeenCalledWith("Updated Title");
        expect(second).toHaveBeenCalledWith("Updated Title");
    });

    it("should notify listeners on every title change", () => {
        const [setTitle, watchTitle] = useTitle("Initial Title");
        const callback = vi.fn();

        watchTitle(callback);

        setTitle("Second Title");
        setTitle("Third Title");

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenNthCalledWith(1, "Second Title");
        expect(callback).toHaveBeenNthCalledWith(2, "Third Title");
    });

    it("should not notify a listener retroactively", () => {
        const [setTitle, watchTitle] = useTitle("Initial Title");

        setTitle("Updated Title");

        const callback = vi.fn();
        watchTitle(callback);

        expect(callback).not.toHaveBeenCalled();

        setTitle("Another Title");

        expect(callback).toHaveBeenCalledWith("Another Title");
    });

    it("should throw when registering a non-function listener", () => {
        const [, watchTitle] = useTitle();

        expect(() => watchTitle()).toThrow(TypeError);
        expect(() => watchTitle(null)).toThrow(TypeError);
        expect(() => watchTitle("callback")).toThrow(TypeError);
        expect(() => watchTitle({})).toThrow(TypeError);
    });

    it("should register the same callback only once", () => {
        const [setTitle, watchTitle] = useTitle("Initial Title");
        const callback = vi.fn();

        watchTitle(callback);
        watchTitle(callback);

        setTitle("Updated Title");

        expect(callback).toHaveBeenCalledOnce();
    });

    /* unsubscribe */

    it("should remove all listeners", () => {
        const [setTitle, watchTitle, unsubscribe] = useTitle("Initial Title");
        const first = vi.fn();
        const second = vi.fn();

        watchTitle(first);
        watchTitle(second);

        unsubscribe();
        setTitle("Updated Title");

        expect(first).not.toHaveBeenCalled();
        expect(second).not.toHaveBeenCalled();
    });

    it("should be safe to call multiple times", () => {
        const [, , unsubscribe] = useTitle();

        expect(() => {
            unsubscribe();
            unsubscribe();
        }).not.toThrow();
    });

    it("should work when no listeners are registered", () => {
        const [setTitle, , unsubscribe] = useTitle("Initial Title");

        expect(() => unsubscribe()).not.toThrow();

        setTitle("Updated Title");

        expect(document.title).toBe("Updated Title");
    });

    it("should still update the document title after unsubscribe", () => {
        const [setTitle, , unsubscribe] = useTitle("Initial Title");

        unsubscribe();
        setTitle("Updated Title");

        expect(document.title).toBe("Updated Title");
    });

    it("should allow registering new listeners after unsubscribe", () => {
        const [setTitle, watchTitle, unsubscribe] = useTitle("Initial Title");
        const callback = vi.fn();

        unsubscribe();
        watchTitle(callback);
        setTitle("Updated Title");

        expect(callback).toHaveBeenCalledWith("Updated Title");
    });

    /* Multiple Instances */

    it("should maintain independent subscribers between instances", () => {
        const [, watchFirst] = useTitle("First Title");
        const [setSecond, watchSecond] = useTitle("Second Title");

        const firstCallback = vi.fn();
        const secondCallback = vi.fn();

        watchFirst(firstCallback);
        watchSecond(secondCallback);

        setSecond("Updated Second Title");

        expect(firstCallback).not.toHaveBeenCalled();
        expect(secondCallback).toHaveBeenCalledWith("Updated Second Title");
    });

    it("should unsubscribe only listeners belonging to its instance", () => {
        const [, watchFirst, unsubscribeFirst] = useTitle("First Title");
        const [setSecond, watchSecond] = useTitle("Second Title");

        const firstCallback = vi.fn();
        const secondCallback = vi.fn();

        watchFirst(firstCallback);
        watchSecond(secondCallback);

        unsubscribeFirst();
        setSecond("Updated Second Title");

        expect(firstCallback).not.toHaveBeenCalled();
        expect(secondCallback).toHaveBeenCalledWith("Updated Second Title");
    });
});