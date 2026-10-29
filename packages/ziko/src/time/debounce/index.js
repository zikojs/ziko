export const debounce = (fn, delay = 1000) => {
    let id;

    return (...args) => {
        clearTimeout(id);

        id = setTimeout(() => {
            fn(...args);
            id = undefined;
        }, delay);
    };
};