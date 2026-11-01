import type {
    StateGetter,
} from '../../state/index.js';

/**
 * Subscribes to document visibility changes.
 *
 * Tracks whether the document is visible using `document.visibilityState`
 * and listens to the `visibilitychange` event.
 *
 * @param withEmitter - Whether to enable change event subscriptions. Defaults to true.
 *
 * @returns A tuple containing:
 * - `isVisible`: Reactive boolean state representing document visibility.
 * - `onChange`: Event subscription function (only available when `withEmitter` is true).
 *
 * @example
 * ```ts
 * const [isVisible, onChange] = useDocumentVisibility();
 *
 * console.log(isVisible().value);
 *
 * onChange(visible => {
 *     console.log(visible ? 'Document visible' : 'Document hidden');
 * });
 * ```
 *
 * @example
 * ```ts
 * const [isVisible] = useDocumentVisibility(false);
 *
 * console.log(isVisible().value);
 * ```
 */
export declare function useDocumentVisibility(
    withEmitter?: true
): [
    isVisible: StateGetter<boolean>,
    onChange: (callback: (visible: boolean) => void) => void
];

/**
 * @see useDocumentVisibility
 */
export declare function useDocumentVisibility(
    withEmitter: false
): [
    isVisible: StateGetter<boolean>
];