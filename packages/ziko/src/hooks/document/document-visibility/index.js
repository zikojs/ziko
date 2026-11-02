export const useDocumentVisibility = () => {
    const subscribers = new Set();
    const getVisibility = () => document.visibilityState === "visible";
    const notify = () => {
        const isVisible = getVisibility();
        subscribers.forEach(callback => callback(isVisible));
    };
    document.addEventListener("visibilitychange", notify);
    const watch = (callback) => {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function");
        }
        subscribers.add(callback);
        callback(getVisibility());
    };
    const unsubscribe = () => {
        subscribers.clear();
        document.removeEventListener("visibilitychange", notify);
    };
    return [watch, unsubscribe];
};