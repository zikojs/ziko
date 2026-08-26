import { STATE_GETTER } from '../symbols/index.js';

export function useDerived(deriveFn, sources) {
    let value = deriveFn(...sources.map(s => s().value));
    const subscribers = new Set();

    // const unsubscribers = sources.map(source => {
    //     const srcValue = source();

    //     return srcValue._subscribe(() => {
    //         const newVal = deriveFn(...sources.map(s => s().value));

    //         if (!Object.is(newVal, value)) {
    //             value = newVal;
    //             subscribers.forEach(fn => fn(value));
    //         }
    //     });
    // });

    const getter = () => ({
        value,
        _subscribe: (fn) => {
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        },
    });

    getter[STATE_GETTER] = true;
    return getter
}