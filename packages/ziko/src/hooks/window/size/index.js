import { throttle } from '../../../time/throttle/index.js';

export const useWindowSize = (
    callback,
    target = 'inner',
    THROTTLE_DELAY = 100
) => {
    const getSize = () => {
        const width =
            target === 'outer'
                ? window.outerWidth
                : window.innerWidth;

        const height =
            target === 'outer'
                ? window.outerHeight
                : window.innerHeight;

        return { width, height };
    };

    const onResize = throttle(() => {
        callback(getSize());
    }, THROTTLE_DELAY);

    window.addEventListener('resize', onResize, {
        passive: true
    });

    const dispose = () => {
        window.removeEventListener('resize', onResize);
    };

    return dispose;
};