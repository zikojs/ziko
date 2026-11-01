export const throttle = (fn, delay) => {
    let lastTime = -Infinity;

    return (...args) => {
        const now = performance.now();

        if (now - lastTime < delay) return;

        lastTime = now;
        fn(...args);
    };
};