const EVENT = "ziko:searchparamschange";
const PATCHED = Symbol.for("ziko/search-params/patched");

const normalizeInitialValue = value => {
    if (value == null) return {};

    if (typeof value === "string") {
        return Object.fromEntries(
            new URLSearchParams(value.startsWith("?") ? value.slice(1) : value)
        );
    }

    if (typeof value === "object" && !Array.isArray(value)) {
        return { ...value };
    }

    throw new TypeError(
        "initialValue must be an object, string, null or undefined"
    );
};

const parseQueryParams = (search, defaults = {}) => ({
    ...defaults,
    ...Object.fromEntries(new URLSearchParams(search))
});

function patchHistory() {
    const { history } = globalThis;

    if (history[PATCHED]) return;

    for (const method of ["pushState", "replaceState"]) {
        const original = history[method];

        history[method] = function (...args) {
            const result = original.apply(this, args);
            globalThis.dispatchEvent(new Event(EVENT));
            return result;
        };
    }

    Object.defineProperty(history, PATCHED, { value: true });
}

export function useSearchParams(initialValue) {
    const defaults = normalizeInitialValue(initialValue);

    const getParams = () =>
        parseQueryParams(location.search, defaults);

    const setParams = (updates, merge = true) => {
        const current = getParams();

        const next = typeof updates === "function"
            ? updates(current)
            : updates;

        if (!next || typeof next !== "object" || Array.isArray(next)) {
            throw new TypeError("Updates must be an object");
        }

        const finalParams = merge
            ? { ...current, ...next }
            : { ...next };

        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(finalParams)) {
            if (value != null) {
                params.set(key, String(value));
            }
        }

        const search = params.toString();

        history.pushState(
            {},
            "",
            `${location.pathname}${search ? `?${search}` : ""}${location.hash}`
        );

        return finalParams;
    };

    const watchParams = callback => {
        if (typeof callback !== "function") {
            throw new TypeError("callback must be a function");
        }

        patchHistory();

        let previousSearch = location.search;

        const notify = () => {
            if (location.search === previousSearch) return;

            previousSearch = location.search;
            callback(getParams());
        };

        addEventListener("popstate", notify);
        addEventListener(EVENT, notify);

        callback(getParams());

        return () => {
            removeEventListener("popstate", notify);
            removeEventListener(EVENT, notify);
        };
    };

    return [setParams, watchParams];
}