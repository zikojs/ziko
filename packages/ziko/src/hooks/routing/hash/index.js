const EVENT = "ziko:hashchange";
const PATCHED = Symbol.for("ziko/hash/patched");

const normalizeHash = value => {
    if (value == null) return "";
    if (typeof value === "string") return value.replace(/^#/, "");

    throw new TypeError(
        "Hash value must be a string, null or undefined"
    );
};

function patchHistory() {
    const { history } = globalThis;

    if (history[PATCHED]) return;

    for (const method of ["pushState", "replaceState"]) {
        const original = history[method];

        history[method] = function (...args) {
            const previous = location.hash;
            const result = original.apply(this, args);

            if (location.hash !== previous) {
                dispatchEvent(new Event(EVENT));
            }

            return result;
        };
    }

    Object.defineProperty(history, PATCHED, { value: true });
}

export function useHash(initialValue) {
    const initialHash = normalizeHash(initialValue);

    const getHash = () => location.hash.replace(/^#/, "");

    const setHash = value => {
        const next = normalizeHash(
            typeof value === "function"
                ? value(getHash())
                : value
        );

        const hash = next ? `#${next}` : "";

        if (location.hash === hash) return getHash();

        history.pushState(
            {},
            "",
            `${location.pathname}${location.search}${hash}`
        );

        return getHash();
    };

    const watchHash = callback => {
        if (typeof callback !== "function") {
            throw new TypeError("callback must be a function");
        }

        patchHistory();

        let previousHash = location.hash;

        const notify = () => {
            if (location.hash === previousHash) return;

            previousHash = location.hash;
            callback(getHash());
        };

        addEventListener("hashchange", notify);
        addEventListener("popstate", notify);
        addEventListener(EVENT, notify);

        callback(getHash());

        return () => {
            removeEventListener("hashchange", notify);
            removeEventListener("popstate", notify);
            removeEventListener(EVENT, notify);
        };
    };

    if (!location.hash && initialHash) {
        setHash(initialHash);
    }

    return [setHash, watchHash];
}