import { throttle } from '../../../time/throttle/index.js';
import { UIElement } from '../../../dom/UIElement/index.js';

export function useBoundingRect(target, callback, THROTTLE_DELAY = 100) {
    if (target instanceof UIElement) target = target.element;
    if (!target?.getBoundingClientRect) throw new TypeError('A valid DOM element is required');
    if (typeof callback !== 'function') throw new TypeError('callback must be a function');

    let observer = null;
    let onResize = null;

    const unsubscribe = () => {
        observer?.disconnect();
        observer = null;
        onResize?.cancel?.();
        onResize = null;
    };

    const signal = arguments[3]?.signal;
    if (signal?.aborted) return [unsubscribe];

    onResize = throttle(() => callback(target.getBoundingClientRect()), THROTTLE_DELAY);

    observer = new ResizeObserver(onResize);
    observer.observe(target);

    callback(target.getBoundingClientRect());

    signal?.addEventListener('abort', unsubscribe, { once: true });

    return () => {
        unsubscribe();
        signal?.removeEventListener('abort', unsubscribe);
    };
}