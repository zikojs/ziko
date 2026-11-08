import { describe, it, expect, vi, beforeEach } from "vitest";
import { useClipboard } from "ziko/hooks/document";

describe("useClipboard", () => {
    let writeText;

    beforeEach(() => {
        writeText = vi.fn().mockResolvedValue(undefined);

        Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: { writeText }
        });
    });

    /* Initialization */

    it("should return the expected API", () => {
        const result = useClipboard();

        expect(result).toHaveLength(3);
        expect(typeof result[0]).toBe("function");
        expect(typeof result[1]).toBe("function");
        expect(typeof result[2]).toBe("function");
    });

    /* copy */

    it("should write text to the clipboard", async () => {
        const [copy] = useClipboard();

        await copy("Hello ZikoJS");

        expect(writeText).toHaveBeenCalledOnce();
        expect(writeText).toHaveBeenCalledWith("Hello ZikoJS");
    });

    it("should return true after a successful copy", async () => {
        const [copy] = useClipboard();

        await expect(copy("Hello ZikoJS")).resolves.toBe(true);
    });

    it("should support empty strings", async () => {
        const [copy] = useClipboard();

        await expect(copy("")).resolves.toBe(true);

        expect(writeText).toHaveBeenCalledWith("");
    });

    it("should reject non-string values", async () => {
        const [copy] = useClipboard();

        await expect(copy()).rejects.toThrow(TypeError);
        await expect(copy(null)).rejects.toThrow(TypeError);
        await expect(copy(123)).rejects.toThrow(TypeError);
        await expect(copy({})).rejects.toThrow(TypeError);

        expect(writeText).not.toHaveBeenCalled();
    });

    it("should propagate clipboard errors", async () => {
        const error = new Error("Clipboard permission denied");

        writeText.mockRejectedValue(error);

        const [copy] = useClipboard();

        await expect(copy("Hello")).rejects.toThrow(error);
    });

    /* watch */

    it("should register a callback", () => {
        const [, watch] = useClipboard();
        const callback = vi.fn();

        expect(() => watch(callback)).not.toThrow();
    });

    it("should notify listeners after a successful copy", async () => {
        const [copy, watch] = useClipboard();
        const callback = vi.fn();

        watch(callback);
        await copy("Hello ZikoJS");

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith("Hello ZikoJS");
    });

    it("should notify multiple listeners", async () => {
        const [copy, watch] = useClipboard();
        const first = vi.fn();
        const second = vi.fn();

        watch(first);
        watch(second);

        await copy("Hello");

        expect(first).toHaveBeenCalledWith("Hello");
        expect(second).toHaveBeenCalledWith("Hello");
    });

    it("should notify listeners on every successful copy", async () => {
        const [copy, watch] = useClipboard();
        const callback = vi.fn();

        watch(callback);

        await copy("First");
        await copy("Second");

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenNthCalledWith(1, "First");
        expect(callback).toHaveBeenNthCalledWith(2, "Second");
    });

    it("should not notify listeners when copying fails", async () => {
        writeText.mockRejectedValue(new Error("Copy failed"));

        const [copy, watch] = useClipboard();
        const callback = vi.fn();

        watch(callback);

        await expect(copy("Hello")).rejects.toThrow("Copy failed");

        expect(callback).not.toHaveBeenCalled();
    });

    it("should throw when registering a non-function callback", () => {
        const [, watch] = useClipboard();

        expect(() => watch()).toThrow(TypeError);
        expect(() => watch(null)).toThrow(TypeError);
        expect(() => watch("callback")).toThrow(TypeError);
        expect(() => watch({})).toThrow(TypeError);
    });

    it("should register the same callback only once", async () => {
        const [copy, watch] = useClipboard();
        const callback = vi.fn();

        watch(callback);
        watch(callback);

        await copy("Hello");

        expect(callback).toHaveBeenCalledOnce();
    });

    /* unsubscribe */

    it("should remove all registered listeners", async () => {
        const [copy, watch, unsubscribe] = useClipboard();
        const first = vi.fn();
        const second = vi.fn();

        watch(first);
        watch(second);

        unsubscribe();
        await copy("Hello");

        expect(first).not.toHaveBeenCalled();
        expect(second).not.toHaveBeenCalled();
    });

    it("should be safe to call unsubscribe multiple times", () => {
        const [, , unsubscribe] = useClipboard();

        expect(() => {
            unsubscribe();
            unsubscribe();
        }).not.toThrow();
    });

    it("should allow registering new listeners after unsubscribe", async () => {
        const [copy, watch, unsubscribe] = useClipboard();
        const callback = vi.fn();

        unsubscribe();
        watch(callback);

        await copy("Hello");

        expect(callback).toHaveBeenCalledWith("Hello");
    });

    it("should continue copying after unsubscribe", async () => {
        const [copy, , unsubscribe] = useClipboard();

        unsubscribe();

        await expect(copy("Hello")).resolves.toBe(true);

        expect(writeText).toHaveBeenCalledWith("Hello");
    });

    /* Multiple Instances */

    it("should maintain independent subscribers between instances", async () => {
        const [copyFirst, watchFirst] = useClipboard();
        const [copySecond, watchSecond] = useClipboard();

        const first = vi.fn();
        const second = vi.fn();

        watchFirst(first);
        watchSecond(second);

        await copyFirst("First");

        expect(first).toHaveBeenCalledWith("First");
        expect(second).not.toHaveBeenCalled();

        await copySecond("Second");

        expect(second).toHaveBeenCalledWith("Second");
    });

    it("should unsubscribe only listeners belonging to its instance", async () => {
        const [copyFirst, watchFirst, unsubscribeFirst] = useClipboard();
        const [, watchSecond] = useClipboard();

        const first = vi.fn();
        const second = vi.fn();

        watchFirst(first);
        watchSecond(second);

        unsubscribeFirst();

        await copyFirst("Hello");

        expect(first).not.toHaveBeenCalled();
        expect(second).not.toHaveBeenCalled();
    });
});