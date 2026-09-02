import { STATE_GETTER } from '../internal-utils/symbols/index.js';

export function useDerived(deriveFn, sources) {
    const getValue = () => deriveFn(...sources.map(source => source().value));

    let value = getValue();
    const subscribers = new Set();

    const notify = () => {
        const newValue = getValue();

        if (Object.is(newValue, value)) return;

        value = newValue;
        subscribers.forEach(fn => fn(value));
    };

    const unsubscribers = sources.map(source => {
        const state = source();
        return state._subscribe(notify);
    });

    const getter = () => ({
        value,
        _subscribe(fn) {
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        },
    });

    getter[STATE_GETTER] = true;

    return getter;
}