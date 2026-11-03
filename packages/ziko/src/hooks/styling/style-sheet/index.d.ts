import type { UIElement } from '../../../dom/UIElement/index.js';

export type StyleSheetUpdater = string | ((current: string) => string);
export type StyleSheetSetter = (css: StyleSheetUpdater, append?: boolean) => void;
export type StyleSheetRemove = () => void;
export type StyleSheetDispose = () => void;

/**
 * Creates and manages a dynamic stylesheet.
 *
 * @param initial Initial CSS content. Defaults to an empty string.
 * @param target DOM element or ZikoJS UIElement where the stylesheet is mounted. Defaults to document.head.
 * @returns A tuple containing set, remove, and dispose.
 *
 * @example
 * ```ts
 * const [set, remove, dispose] = createStyleSheet('.box { color: red; }');
 *
 * // Replace existing CSS
 * set('.box { color: blue; }');
 *
 * // Append CSS
 * set('.title { font-size: 20px; }', true);
 *
 * // Functional update
 * set(css => css.replace('blue', 'green'));
 *
 * // Functional append
 * set(css => '\n.button { color: white; }', true);
 *
 * // Temporarily remove the stylesheet
 * remove();
 *
 * // Recreate it
 * set('.box { color: green; }');
 *
 * // Permanently destroy the instance
 * dispose();
 * ```
 *
 * @example
 * ```ts
 * const [set, remove, dispose] = createStyleSheet(
 *     '.section { color: red; }',
 *     section
 * );
 * ```
 */
export declare function createStyleSheet(
    initial?: string,
    target?: Element | UIElement
): [
    set: StyleSheetSetter,
    remove: StyleSheetRemove,
    dispose: StyleSheetDispose
];