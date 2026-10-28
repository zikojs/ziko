export declare const STATE_GETTER: unique symbol;

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
 * Creates a reactive state.
 *
 * @param initialValue Initial state value.
 *
 * @example
 * const [count, setCount] = useState(0);
 */
export function useState<T>(
    initialValue: T
): [
    /** Getter function */
    StateGetter<T>,

    /** Setter function */
    (newValue: T | ((prev: T) => T)) => void,

    /** Controller */
    {
        pause: () => void;
        resume: () => void;
        clear: () => void;
        force: (newValue: T | ((prev: T) => T)) => void;
        getSubscribers: () => Set<(value: T) => void>;
    }
];

/**
 * Checks if a value is a state getter.
 */
export function isStateGetter(arg: unknown): arg is StateGetter<unknown>;