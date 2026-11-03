export const useFavicon = (initialHref) => {
    let link = document.querySelector('link[rel~="icon"]');
    if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
    }
    let href = initialHref ?? link.href ?? "";
    const subscribers = new Set();
    link.href = href;
    const setIcon = (newHref) => {
        if (typeof newHref === "function") newHref = newHref(href);
        if (Object.is(href, newHref)) return;
        href = newHref;
        link.href = href;
        subscribers.forEach(callback => callback(href));
    };
    const watchIcon = (callback) => {
        if (typeof callback !== "function")
            throw new TypeError("Callback must be a function");
        subscribers.add(callback);
    };
    const unsubscribe = () => subscribers.clear();
    return [setIcon, watchIcon, unsubscribe];
};