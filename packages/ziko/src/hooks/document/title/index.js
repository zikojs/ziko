export const useTitle = (initialTitle = document.title) => {
    let title = initialTitle;
    const subscribers = new Set();
    document.title = title;
    const setTitle = (newTitle) => {
        if (typeof newTitle === "function") newTitle = newTitle(title);
        if (Object.is(title, newTitle)) return;
        title = newTitle;
        document.title = title;
        subscribers.forEach(callback => callback(title));
    };
    const watchTitle = (callback) => {
        if (typeof callback !== "function") throw new TypeError("Callback must be a function");
        subscribers.add(callback);
    };
    const unsubscribe = () => subscribers.clear();
    return [setTitle, watchTitle, unsubscribe];
};