export function useHistory() {
    const undo = () => {
        globalThis.history.back();
    };

    const redo = () => {
        globalThis.history.forward();
    };

    const go = (delta) => {
        if (!Number.isInteger(delta)) {
            throw new TypeError("delta must be an integer");
        }

        globalThis.history.go(delta);
    };

    return { undo, redo, go };
}