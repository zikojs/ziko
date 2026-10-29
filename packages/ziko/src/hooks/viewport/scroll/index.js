import { throttle } from '../../../time/throttle/index.js';
import { UIElement } from '../../../dom/index.js';

export const useScroll = (target, callback, THROTTLE_DELAY = 100) => {
    const isWindow = target === window;
    if(!isWindow && target instanceof UIElement) target = target.element;

    const getPosition = () => ({
        x: isWindow ? target.scrollX : target.scrollLeft,
        y: isWindow ? target.scrollY : target.scrollTop
    });

    const setScroll = ({ x, y, behavior = 'instant' }) => {
        const current = getPosition();

        const nextX = typeof x === 'function' ? x(current.x) : x ?? current.x;
        const nextY = typeof y === 'function' ? y(current.y) : y ?? current.y;

        target.scrollTo({
            left: nextX,
            top: nextY,
            behavior
        });
    };

    const onScroll = throttle(() => {
        callback?.(getPosition());
    }, THROTTLE_DELAY);

    target.addEventListener('scroll', onScroll, { passive: true });

    const dispose = () => {
        target.removeEventListener('scroll', onScroll);
    };

    return [setScroll, dispose];
};