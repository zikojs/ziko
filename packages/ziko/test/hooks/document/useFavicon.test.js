import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFavicon } from "ziko/hooks";

describe("useFavicon", () => {
    let link;

    beforeEach(() => {
        document.head.innerHTML = "";

        link = document.createElement("link");
        link.rel = "icon";
        link.href = "/default.ico";

        document.head.appendChild(link);
    });

    /* Initialization */

    it("should return the expected API", () => {
        const result = useFavicon("/favicon.png");

        expect(result).toHaveLength(3);
        expect(result.every(fn => typeof fn === "function")).toBe(true);
    });

    it("should use the initial href", () => {
        useFavicon("/favicon.png");

        expect(link.getAttribute("href")).toBe("/favicon.png");
    });

    it("should use the existing favicon when no initial href is provided", () => {
        useFavicon();

        expect(link.href).toBe(new URL("/default.ico", document.baseURI).href);
    });

    it("should create a favicon link when none exists", () => {
        document.head.innerHTML = "";

        useFavicon("/favicon.png");

        const favicon = document.querySelector('link[rel~="icon"]');

        expect(favicon).not.toBeNull();
        expect(favicon.getAttribute("href")).toBe("/favicon.png");
    });

    it("should reuse the existing favicon link", () => {
        const existingLink = link;

        useFavicon("/new-icon.png");

        expect(document.querySelectorAll('link[rel~="icon"]')).toHaveLength(1);
        expect(document.querySelector('link[rel~="icon"]')).toBe(existingLink);
    });

    /* setIcon */

    it("should update the favicon", () => {
        const [setIcon] = useFavicon("/initial.png");

        setIcon("/updated.png");

        expect(link.getAttribute("href")).toBe("/updated.png");
    });

    it("should support functional updates", () => {
        const [setIcon] = useFavicon("/initial.png");

        setIcon(current => current.replace("initial", "updated"));

        expect(link.getAttribute("href")).toBe("/updated.png");
    });

    it("should not notify listeners when the href is unchanged", () => {
        const [setIcon, watchIcon] = useFavicon("/initial.png");
        const callback = vi.fn();

        watchIcon(callback);
        setIcon("/initial.png");

        expect(callback).not.toHaveBeenCalled();
    });

    it("should not update the favicon when the href is unchanged", () => {
        const [setIcon] = useFavicon("/initial.png");
        const spy = vi.spyOn(link, "setAttribute");

        setIcon("/initial.png");

        expect(spy).not.toHaveBeenCalled();
    });

    /* watchIcon */

    it("should register a listener", () => {
        const [, watchIcon,] = useFavicon("/initial.png");
        const callback = vi.fn();

        expect(() => watchIcon(callback)).not.toThrow();
    });

    it("should notify listeners when the favicon changes", () => {
        const [setIcon, watchIcon] = useFavicon("/initial.png");
        const callback = vi.fn();

        watchIcon(callback);
        setIcon("/updated.png");

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith("/updated.png");
    });

    it("should notify multiple listeners", () => {
        const [setIcon, watchIcon] = useFavicon("/initial.png");
        const first = vi.fn();
        const second = vi.fn();

        watchIcon(first);
        watchIcon(second);

        setIcon("/updated.png");

        expect(first).toHaveBeenCalledWith("/updated.png");
        expect(second).toHaveBeenCalledWith("/updated.png");
    });

    it("should notify listeners on every change", () => {
        const [setIcon, watchIcon] = useFavicon("/initial.png");
        const callback = vi.fn();

        watchIcon(callback);

        setIcon("/second.png");
        setIcon("/third.png");

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenNthCalledWith(1, "/second.png");
        expect(callback).toHaveBeenNthCalledWith(2, "/third.png");
    });

    it("should not notify a listener retroactively", () => {
        const [setIcon, watchIcon] = useFavicon("/initial.png");

        setIcon("/updated.png");

        const callback = vi.fn();
        watchIcon(callback);

        expect(callback).not.toHaveBeenCalled();

        setIcon("/another.png");

        expect(callback).toHaveBeenCalledWith("/another.png");
    });

    it("should throw when registering a non-function listener", () => {
        const [, watchIcon] = useFavicon();

        expect(() => watchIcon()).toThrow(TypeError);
        expect(() => watchIcon(null)).toThrow(TypeError);
        expect(() => watchIcon("callback")).toThrow(TypeError);
        expect(() => watchIcon({})).toThrow(TypeError);
    });

    it("should register the same callback only once", () => {
        const [setIcon, watchIcon] = useFavicon("/initial.png");
        const callback = vi.fn();

        watchIcon(callback);
        watchIcon(callback);

        setIcon("/updated.png");

        expect(callback).toHaveBeenCalledOnce();
    });

    /* unsubscribe */

    it("should remove all listeners", () => {
        const [setIcon, watchIcon, unsubscribe] = useFavicon("/initial.png");
        const first = vi.fn();
        const second = vi.fn();

        watchIcon(first);
        watchIcon(second);

        unsubscribe();
        setIcon("/updated.png");

        expect(first).not.toHaveBeenCalled();
        expect(second).not.toHaveBeenCalled();
    });

    it("should be safe to call multiple times", () => {
        const [, , unsubscribe] = useFavicon();

        expect(() => {
            unsubscribe();
            unsubscribe();
        }).not.toThrow();
    });

    it("should work when no listeners are registered", () => {
        const [setIcon, , unsubscribe] = useFavicon("/initial.png");

        expect(() => unsubscribe()).not.toThrow();

        setIcon("/updated.png");

        expect(link.getAttribute("href")).toBe("/updated.png");
    });

    it("should still update the favicon after unsubscribe", () => {
        const [setIcon, , unsubscribe] = useFavicon("/initial.png");

        unsubscribe();
        setIcon("/updated.png");

        expect(link.getAttribute("href")).toBe("/updated.png");
    });

    it("should allow registering new listeners after unsubscribe", () => {
        const [setIcon, watchIcon, unsubscribe] = useFavicon("/initial.png");
        const callback = vi.fn();

        unsubscribe();
        watchIcon(callback);
        setIcon("/updated.png");

        expect(callback).toHaveBeenCalledWith("/updated.png");
    });

    /* Multiple Instances */

    it("should maintain independent subscribers between instances", () => {
        const [, watchFirst] = useFavicon("/first.png");
        const [setSecond, watchSecond] = useFavicon("/second.png");

        const firstCallback = vi.fn();
        const secondCallback = vi.fn();

        watchFirst(firstCallback);
        watchSecond(secondCallback);

        setSecond("/second-updated.png");

        expect(firstCallback).not.toHaveBeenCalled();
        expect(secondCallback).toHaveBeenCalledWith("/second-updated.png");
    });

    it("should unsubscribe only listeners belonging to its instance", () => {
        const [, watchFirst, unsubscribeFirst] = useFavicon("/first.png");
        const [setSecond, watchSecond] = useFavicon("/second.png");

        const firstCallback = vi.fn();
        const secondCallback = vi.fn();

        watchFirst(firstCallback);
        watchSecond(secondCallback);

        unsubscribeFirst();
        setSecond("/second-updated.png");

        expect(firstCallback).not.toHaveBeenCalled();
        expect(secondCallback).toHaveBeenCalledWith("/second-updated.png");
    });
});