import { isStateGetter } from "./use-state.js";

export const useEffect = (callback, deps = []) =>{
    const states = deps.filter(isStateGetter);

    let cleanup;

    const execute = () => {
        // Cleanup previous effect
        if (typeof cleanup === "function") {
            cleanup();
        }

        // Read current state values
        const values = states.map(state => state().value);

        // Execute effect
        cleanup = callback(...values);
    };

    // Subscribe to states
    const unsubscribers = states.map(state =>
        state()._subscribe(execute)
    );

    // Initial execution
    execute();

    // Return effect cleanup
    return () => {
        unsubscribers.forEach(unsubscribe => {
            unsubscribe();
        });

        if (typeof cleanup === "function") {
            cleanup();
            cleanup = undefined;
        }
    };
}