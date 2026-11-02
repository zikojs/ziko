export type TitleChangeCallback = (title: string) => void;

export type TitleChangeListener = (
    callback: TitleChangeCallback
) => void;

export type TitleStateSetter = (
    newTitle: string | ((currentTitle: string) => string)
) => void;

export type TitleUnsubscribe = () => void;

export type UseTitleResult = [
    setTitle: TitleStateSetter,
    watchTitle: TitleChangeListener,
    unsubscribe: TitleUnsubscribe
];

/**
 * Manages the document title and provides a listener mechanism
 * for tracking title changes.
 *
 * @param initialTitle - Initial document title. Defaults to the current document title.
 * @returns A tuple containing the title setter, listener registration function,
 * and unsubscribe function.
 *
 * @example
 * ```js
 * const [setTitle, watchTitle, unsubscribe] = useTitle("ZikoJS");
 *
 * watchTitle((title) => {
 *     console.log("Title changed:", title);
 * });
 *
 * setTitle("ZikoJS Documentation");
 * ```
 *
 * @example Functional update
 * ```js
 * const [setTitle] = useTitle("ZikoJS");
 *
 * setTitle((currentTitle) => `${currentTitle} Documentation`);
 * ```
 *
 * @example Unsubscribe all listeners
 * ```js
 * const [setTitle, watchTitle, unsubscribe] = useTitle("ZikoJS");
 *
 * watchTitle((title) => console.log(title));
 *
 * unsubscribe();
 *
 * // Updates the document title without notifying listeners.
 * setTitle("New Title");
 * ```
 */
export declare function useTitle(
    initialTitle?: string
): UseTitleResult;