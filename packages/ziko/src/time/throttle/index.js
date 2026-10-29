export const throttle = (fn, delay) => {
    let lastTime = 0;

    return (...args) => {
        const now = performance.now();

        if (now - lastTime < delay) return;

        lastTime = now;
        fn(...args);
    };
};