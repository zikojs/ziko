
import {
    describe,
    it,
    expect,
    vi,
    beforeEach,
    afterEach
} from "vitest";

import { useSearchParams } from "ziko/hooks/routing";

const EVENT = "ziko:searchparamschange";
const PATCHED = Symbol.for("ziko/search-params/patched");

let cleanups = [];

const watch = (...args) => {
    const unsubscribe = args[0](args[1]);

    cleanups.push(unsubscribe);

    return unsubscribe;
};

beforeEach(() => {
    cleanups = [];

    history.replaceState({}, "", "/");
});

afterEach(() => {
    for (const cleanup of cleanups) {
        cleanup();
    }

    cleanups = [];
});

/* Initialization */

describe("useSearchParams initialization", () => {
    it("should return setParams and watchParams", () => {
        const result = useSearchParams();

        expect(result).toHaveLength(2);
        expect(result[0]).toBeTypeOf("function");
        expect(result[1]).toBeTypeOf("function");
    });

    it("should accept an object as initial value", () => {
        const [setParams, watchParams] = useSearchParams({
            page: "home",
            theme: "dark"
        });

        expect(setParams({})).toEqual({
            page: "home",
            theme: "dark"
        });
    });

    it("should accept a query string as initial value", () => {
        const [setParams] = useSearchParams("page=home&theme=dark");

        expect(setParams({})).toEqual({
            page: "home",
            theme: "dark"
        });
    });

    it("should accept a query string starting with ?", () => {
        const [setParams] = useSearchParams("?page=home&theme=dark");

        expect(setParams({})).toEqual({
            page: "home",
            theme: "dark"
        });
    });

    it("should accept null as initial value", () => {
        const [setParams] = useSearchParams(null);

        expect(setParams({})).toEqual({});
    });

    it("should accept undefined as initial value", () => {
        const [setParams] = useSearchParams(undefined);

        expect(setParams({})).toEqual({});
    });

    it("should reject invalid initial values", () => {
        for (const value of [123, true, [], () => {}]) {
            expect(() => useSearchParams(value)).toThrow(TypeError);
        }
    });

    it("should create independent defaults for each instance", () => {
        history.replaceState({}, "", "/");

        const [setFirst] = useSearchParams({ page: "home" });
        const [setSecond] = useSearchParams({ page: "about" });

        expect(setFirst({})).toEqual({ page: "home" });

        history.replaceState({}, "", "/");

        expect(setSecond({})).toEqual({ page: "about" });
    });
});

/* Reading */

describe("Search params reading", () => {
    it("should read parameters from the URL", () => {
        history.replaceState({}, "", "/?page=home&theme=dark");

        const [setParams] = useSearchParams();

        expect(setParams({})).toEqual({
            page: "home",
            theme: "dark"
        });
    });

    it("should prioritize URL parameters over defaults", () => {
        history.replaceState({}, "", "/?page=about");

        const [setParams] = useSearchParams({
            page: "home",
            theme: "dark"
        });

        expect(setParams({})).toEqual({
            page: "about",
            theme: "dark"
        });
    });

    it("should preserve defaults missing from the URL", () => {
        history.replaceState({}, "", "/?page=home");

        const [setParams] = useSearchParams({
            page: "default",
            theme: "dark",
            language: "en"
        });

        expect(setParams({})).toEqual({
            page: "home",
            theme: "dark",
            language: "en"
        });
    });

    it("should decode URL-encoded values", () => {
        history.replaceState({}, "", "/?name=John%20Doe");

        const [setParams] = useSearchParams();

        expect(setParams({})).toEqual({
            name: "John Doe"
        });
    });

    it("should handle empty query parameters", () => {
        history.replaceState({}, "", "/?page=&theme=dark");

        const [setParams] = useSearchParams();

        expect(setParams({})).toEqual({
            page: "",
            theme: "dark"
        });
    });

    it("should use the last value for duplicate parameters", () => {
        history.replaceState({}, "", "/?tag=js&tag=ziko");

        const [setParams] = useSearchParams();

        expect(setParams({})).toEqual({
            tag: "ziko"
        });
    });

    it("should return defaults when the URL has no parameters", () => {
        const [setParams] = useSearchParams({
            page: "home"
        });

        expect(setParams({})).toEqual({
            page: "home"
        });
    });
});

/* setParams */

describe("setParams", () => {
    it("should add new parameters", () => {
        const [setParams] = useSearchParams();

        setParams({
            page: "home",
            theme: "dark"
        });

        expect(location.search).toBe("?page=home&theme=dark");
    });

    it("should update existing parameters", () => {
        history.replaceState({}, "", "/?page=home");

        const [setParams] = useSearchParams();

        setParams({
            page: "about"
        });

        expect(location.search).toBe("?page=about");
    });

    it("should merge updates with existing parameters by default", () => {
        history.replaceState({}, "", "/?page=home&theme=dark");

        const [setParams] = useSearchParams();

        setParams({
            page: "about"
        });

        expect(location.search).toBe("?page=about&theme=dark");
    });

    it("should replace all parameters when merge is false", () => {
        history.replaceState({}, "", "/?page=home&theme=dark");

        const [setParams] = useSearchParams();

        setParams({
            page: "about"
        }, false);

        expect(location.search).toBe("?page=about");
    });

    it("should support functional updates", () => {
        history.replaceState({}, "", "/?page=home");

        const [setParams] = useSearchParams();

        setParams(current => ({
            ...current,
            page: "about",
            theme: "dark"
        }));

        expect(location.search).toBe("?page=about&theme=dark");
    });

    it("should pass current parameters to the updater", () => {
        history.replaceState({}, "", "/?page=home");

        const [setParams] = useSearchParams();
        const updater = vi.fn(current => current);

        setParams(updater);

        expect(updater).toHaveBeenCalledOnce();
        expect(updater).toHaveBeenCalledWith({
            page: "home"
        });
    });

    it("should remove parameters with null values", () => {
        history.replaceState({}, "", "/?page=home&theme=dark");

        const [setParams] = useSearchParams();

        setParams({
            theme: null
        });

        expect(location.search).toBe("?page=home");
    });

    it("should remove parameters with undefined values", () => {
        history.replaceState({}, "", "/?page=home&theme=dark");

        const [setParams] = useSearchParams();

        setParams({
            theme: undefined
        });

        expect(location.search).toBe("?page=home");
    });

    it("should convert values to strings", () => {
        const [setParams] = useSearchParams();

        setParams({
            page: 2,
            active: true,
            count: 0
        });

        expect(location.search).toBe("?page=2&active=true&count=0");
    });

    it("should encode special characters", () => {
        const [setParams] = useSearchParams();

        setParams({
            name: "John Doe",
            email: "john@example.com"
        });

        expect(new URLSearchParams(location.search).get("name"))
            .toBe("John Doe");

        expect(new URLSearchParams(location.search).get("email"))
            .toBe("john@example.com");
    });

    it("should preserve pathname and hash", () => {
        history.replaceState({}, "", "/dashboard?old=1#profile");

        const [setParams] = useSearchParams();

        setParams({
            page: "home"
        });

        expect(location.pathname).toBe("/dashboard");
        expect(location.hash).toBe("#profile");
        expect(location.search).toBe("?old=1&page=home");
    });

    it("should return the final parameters", () => {
        const [setParams] = useSearchParams({
            page: "home"
        });

        const result = setParams({
            theme: "dark"
        });

        expect(result).toEqual({
            page: "home",
            theme: "dark"
        });
    });

    it("should return the final parameters when replacing", () => {
        const [setParams] = useSearchParams({
            page: "home"
        });

        const result = setParams({
            theme: "dark"
        }, false);

        expect(result).toEqual({
            theme: "dark"
        });
    });

    it("should reject invalid updates", () => {
        const [setParams] = useSearchParams();

        for (const value of [null, undefined, "page=home", 123, true, []]) {
            expect(() => setParams(value)).toThrow(TypeError);
        }
    });

    it("should reject invalid updater results", () => {
        const [setParams] = useSearchParams();

        expect(() => setParams(() => null)).toThrow(TypeError);
        expect(() => setParams(() => "invalid")).toThrow(TypeError);
        expect(() => setParams(() => [])).toThrow(TypeError);
    });
});

/* watchParams */

describe("watchParams", () => {
    it("should call the callback immediately", () => {
        const callback = vi.fn();
        const [, watchParams] = useSearchParams({
            page: "home"
        });

        watch(watchParams, callback);

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith({
            page: "home"
        });
    });

    it("should observe parameter changes through setParams", () => {
        const callback = vi.fn();
        const [setParams, watchParams] = useSearchParams();

        watch(watchParams, callback);

        setParams({
            page: "home"
        });

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith({
            page: "home"
        });
    });

    it("should observe changes through pushState", () => {
        const callback = vi.fn();
        const [, watchParams] = useSearchParams();

        watch(watchParams, callback);

        history.pushState({}, "", "/?page=about");

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith({
            page: "about"
        });
    });

    it("should observe changes through replaceState", () => {
        const callback = vi.fn();
        const [, watchParams] = useSearchParams();

        watch(watchParams, callback);

        history.replaceState({}, "", "/?page=about");

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith({
            page: "about"
        });
    });

    it("should observe popstate events", () => {
        const callback = vi.fn();
        const [, watchParams] = useSearchParams();

        watch(watchParams, callback);

        history.replaceState({}, "", "/?page=about");

        // Reset the callback count after the history update.
        callback.mockClear();

        history.replaceState({}, "", "/?page=home");

        // Simulate browser navigation.
        dispatchEvent(new PopStateEvent("popstate"));

        expect(callback).toHaveBeenCalledOnce();
        expect(callback).toHaveBeenCalledWith({
            page: "home"
        });
    });

    it("should ignore events when the search string has not changed", () => {
        const callback = vi.fn();
        const [, watchParams] = useSearchParams();

        watch(watchParams, callback);

        callback.mockClear();

        dispatchEvent(new PopStateEvent("popstate"));
        dispatchEvent(new Event(EVENT));

        expect(callback).not.toHaveBeenCalled();
    });

    it("should not notify when only the hash changes", () => {
        const callback = vi.fn();
        const [, watchParams] = useSearchParams();

        watch(watchParams, callback);

        callback.mockClear();

        history.pushState({}, "", "/#profile");

        expect(callback).not.toHaveBeenCalled();
    });

    it("should support multiple watchers", () => {
        const first = vi.fn();
        const second = vi.fn();

        const [setParams, watchParams] = useSearchParams();

        watch(watchParams, first);
        watch(watchParams, second);

        setParams({
            page: "home"
        });

        expect(first).toHaveBeenCalledTimes(2);
        expect(second).toHaveBeenCalledTimes(2);
    });

    it("should unsubscribe a watcher", () => {
        const callback = vi.fn();
        const [setParams, watchParams] = useSearchParams();

        const unsubscribe = watch(watchParams, callback);

        unsubscribe();
        callback.mockClear();

        setParams({
            page: "home"
        });

        expect(callback).not.toHaveBeenCalled();
    });

    it("should reject non-function callbacks", () => {
        const [, watchParams] = useSearchParams();

        expect(() => watchParams(null)).toThrow(TypeError);
        expect(() => watchParams("callback")).toThrow(TypeError);
        expect(() => watchParams({})).toThrow(TypeError);
    });

    it("should return an unsubscribe function", () => {
        const [, watchParams] = useSearchParams();

        const unsubscribe = watchParams(() => {});

        expect(unsubscribe).toBeTypeOf("function");
    });
});

/* History patching */

describe("History patching", () => {
    it("should patch history only once", () => {
        const [, watchParams] = useSearchParams();

        watch(watchParams, () => {});

        const patchedPushState = history.pushState;
        const patchedReplaceState = history.replaceState;

        const [, anotherWatchParams] = useSearchParams();

        watch(anotherWatchParams, () => {});

        expect(history.pushState).toBe(patchedPushState);
        expect(history.replaceState).toBe(patchedReplaceState);
        expect(history[PATCHED]).toBe(true);
    });

    it("should preserve the original pushState return value", () => {
        const [, watchParams] = useSearchParams();

        watch(watchParams, () => {});

        const result = history.pushState({}, "", "/?page=home");

        expect(result).toBeUndefined();
    });

    it("should preserve the original replaceState return value", () => {
        const [, watchParams] = useSearchParams();

        watch(watchParams, () => {});

        const result = history.replaceState({}, "", "/?page=home");

        expect(result).toBeUndefined();
    });

    it("should dispatch the custom event on pushState", () => {
        const listener = vi.fn();

        addEventListener(EVENT, listener);

        const [, watchParams] = useSearchParams();

        watch(watchParams, () => {});

        history.pushState({}, "", "/?page=home");

        expect(listener).toHaveBeenCalledOnce();

        removeEventListener(EVENT, listener);
    });

    it("should dispatch the custom event on replaceState", () => {
        const listener = vi.fn();

        addEventListener(EVENT, listener);

        const [, watchParams] = useSearchParams();

        watch(watchParams, () => {});

        history.replaceState({}, "", "/?page=home");

        expect(listener).toHaveBeenCalledOnce();

        removeEventListener(EVENT, listener);
    });
});
