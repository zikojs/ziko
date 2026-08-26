import { useState } from "./use-state.js";
const parseQueryParams = queryString => Object.fromEntries(new URLSearchParams(globalThis?.location?.search))

export function useQueryParams() {
    const getParams = () =>
        parseQueryParams(window.location.search);

    const setParams = (updates, merge = true) => {
        const current = getParams();

        const next =
            typeof updates === "function"
                ? updates(current)
                : updates;

        const finalParams = merge
            ? { ...current, ...next }
            : next;

        const search = new URLSearchParams(finalParams).toString();

        window.history.pushState(
            {},
            "",
            `${window.location.pathname}${search ? `?${search}` : ""}`
        );

        window.dispatchEvent(
            new CustomEvent("queryparamschange", {
                detail: finalParams
            })
        );
    };

    return [getParams, setParams];
}

export function watchQueryParams(callback) {
    let previousSearch = location.search;

    const notify = () => {
        const currentSearch = location.search;

        if (currentSearch === previousSearch) {
            return;
        }

        previousSearch = currentSearch;
        callback(parseQueryParams(currentSearch));
    };

    window.addEventListener("popstate", notify);

    const pushState = history.pushState;
    history.pushState = function (...args) {
        pushState.apply(this, args);
        notify();
    };

    const replaceState = history.replaceState;
    history.replaceState = function (...args) {
        replaceState.apply(this, args);
        notify();
    };

    callback(parseQueryParams(location.search));

    return () => {
        window.removeEventListener("popstate", notify);
    };
}