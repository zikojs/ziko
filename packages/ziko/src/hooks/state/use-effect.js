import { isStateGetter } from "./use-state.js";

export const useEffect = (callback, deps = []) => {
    const states = deps.filter(isStateGetter);
    let cleanup;

    const getValues = () =>
        states.map(state => state().value);

    const execute = () => {
        if (typeof cleanup === "function") {
            cleanup();
        }

        cleanup = callback(getValues());
    };

    const unsubscribers = states.map(state =>
        state()._subscribe(execute)
    );

    execute();

    return () => {
        unsubscribers.forEach(unsubscribe => unsubscribe());

        if (typeof cleanup === "function") {
            cleanup();
            cleanup = undefined;
        }
    };
};