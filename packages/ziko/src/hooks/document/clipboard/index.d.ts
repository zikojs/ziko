import type {
    StateGetter,
} from '../../state/index.js';

/**
 * Provides reactive access to the system clipboard.
 *
 * Uses the Clipboard API to read and write text.
 *
 * @param withEmitter - Whether to enable clipboard change subscriptions. Defaults to true.
 *
 * @returns A tuple containing:
 * - `text`: Reactive state containing the clipboard text.
 * - `copy`: Writes text to the clipboard.
 * - `read`: Reads text from the clipboard.
 * - `onChange`: Event subscription function (only available when `withEmitter` is true).
 *
 * @example
 * ```ts
 * const [text, copy, read, onChange] = useClipboard();
 *
 * await copy('Hello ZikoJS!');
 *
 * console.log(text().value);
 *
 * onChange(value => {
 *     console.log('Clipboard updated:', value);
 * });
 * ```
 *
 * @example
 * ```ts
 * const [text, copy, read] = useClipboard(false);
 *
 * await copy('Hello World');
 *
 * const value = await read();
 * console.log(value);
 * ```
 */
export declare function useClipboard(
    withEmitter?: true
): [
    text: StateGetter<string>,
    copy: (value: string) => Promise<true>,
    read: () => Promise<string>,
    onChange: (callback: (value: string) => void) => void
];

/**
 * @see useClipboard
 */
export declare function useClipboard(
    withEmitter: false
): [
    text: StateGetter<string>,
    copy: (value: string) => Promise<true>,
    read: () => Promise<string>
];