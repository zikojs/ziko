/**
 * Browser navigation history controls.
 */
export interface NavigationHistory {
    /** Navigate to the previous history entry. */
    undo: () => void;

    /** Navigate to the next history entry. */
    redo: () => void;

    /**
     * Navigate relative to the current history entry.
     * @param delta Negative values go backward; positive values go forward.
     */
    go: (delta: number) => void;
}

/**
 * Provides browser navigation history controls.
 *
 * @example
 * ```js
 * const { undo, redo, go } = useNavigationHistory();
 *
 * undo();  // Go to the previous page
 * redo();  // Go to the next page
 * go(-2);  // Go back two entries
 * go(3);   // Go forward three entries
 * ```
 */
export declare function useNavigationHistory(): NavigationHistory;