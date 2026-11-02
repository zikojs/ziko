export const useClipboard = () => {
    const subscribers = new Set();
    const copy = async (value) => {
        if (typeof value !== "string") {
            throw new TypeError("Clipboard value must be a string");
        }
        await navigator.clipboard.writeText(value);
        subscribers.forEach(callback => callback(value));
        return true;
    };
    const watch = (callback) => {
        if (typeof callback !== "function") {
            throw new TypeError("Callback must be a function");
        }
        subscribers.add(callback);
    };
    const unsubscribe = () =>  subscribers.clear();
    return [copy, watch, unsubscribe];
};