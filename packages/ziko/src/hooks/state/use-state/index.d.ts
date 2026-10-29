export declare const STATE_GETTER: unique symbol;

/**
 * A value or an updater function receiving the previous state.
 */
export type SetStateAction<T> = T | ((prev: T) => T);

/**
 * Reactive state getter.
 */
export type StateGetter<T> = (() => {
    value: T;
    _subscribe: (fn: (value: T) => void) => () => void;
}) & {
    [STATE_GETTER]: true;
};

/**
 * State controller.
 */
export interface StateController<T> {
    pause: () => void;
    resume: () => void;
    clear: () => void;
    force: (newValue: SetStateAction<T>) => void;
    getSubscribers: () => Set<(value: T) => void>;
}

/**
 * Creates a reactive state.
 *
 * @param initialValue Initial state value.
 *
 * @example
 * const [count, setCount] = useState(0);
 *
 * setCount(10);
 * setCount(prev => prev + 1);
 */
export declare function useState<T>(
    initialValue: T
): [
    /** Getter function */
    StateGetter<T>,

    /** Setter function */
    (newValue: SetStateAction<T>) => void,

    /** Controller */
    StateController<T>
];

/**
 * Checks if a value is a state getter.
 */
export declare function isStateGetter(
    arg: unknown
): arg is StateGetter<unknown>;