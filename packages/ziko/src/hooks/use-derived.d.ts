export function useDerived<T>(
    deriveFn: (...values: any[]) => T,
    sources: Array<
        () => {
            value: any;
            isStateGetter: () => true;
            _subscribe: (fn: (value: any) => void) => void;
        }
    >
): () => {
    value: T;
    isStateGetter: () => true;
    _subscribe: (fn: (value: T) => void) => void;
};
