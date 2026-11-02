export const useOnline = () => {
    const subscribers = new Set();
    const notify = () => {
        const isOnline = navigator.onLine;
        subscribers.forEach(callback => callback(isOnline));
    };
    window.addEventListener("online", notify);
    window.addEventListener("offline", notify);
    const watch = (callback) => {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function");
        }
        subscribers.add(callback);
        callback(navigator.onLine);
    };
    const unsubscribe = () => {
        subscribers.clear();
        window.removeEventListener("online", notify);
        window.removeEventListener("offline", notify);
    };
    return [watch, unsubscribe];
};