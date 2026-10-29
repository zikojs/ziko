import { throttle } from '../../../time/throttle/index.js';

export const useWindowScroll = (callback, THROTTLE_DELAY = 100) => {
    const setScroll = ({ x, y, behavior = 'instant' }) => {
        const currentX = window.scrollX;
        const currentY = window.scrollY;

        const nextX = typeof x === 'function' ? x(currentX) : x ?? currentX;
        const nextY = typeof y === 'function' ? y(currentY) : y ?? currentY;

        window.scrollTo({
            left: nextX,
            top: nextY,
            behavior
        });
    };

    const onScroll = throttle(() => {
        callback?.({
            x: window.scrollX,
            y: window.scrollY
        });
    }, THROTTLE_DELAY);

    window.addEventListener('scroll', onScroll, {
        passive: true
    });

    const dispose = () => {
        window.removeEventListener('scroll', onScroll);
    };

    return [setScroll, dispose];
};