import type { UIElement } from '../../../dom/UIElement/index.js';

export type CssVarsData = Record<string, string | number>;

export type CssVarsTarget =
    | Document
    | HTMLElement
    | SVGElement
    | UIElement;

export type CssVarsSetter = (
    updates: CssVarsData | ((current: CssVarsData) => CssVarsData)
) => Record<string, string>;

export type UseCssVarsResult = [
    vars: Record<string, string>,
    setVars: CssVarsSetter
];

export interface UseCssVarsOptions {
    /**
     * CSS custom property namespace.
     * @default "ziko"
     */
    namespace?: string;

    /**
     * Element where CSS variables will be applied.
     * Accepts a Document, native Element, or ZikoJS UIElement.
     * @default document
     */
    target?: CssVarsTarget;
}

/**
 * Creates reactive CSS custom properties.
 *
 * @param initialData Initial CSS variable values.
 * @param options Configuration options.
 * @returns A tuple containing CSS variable references and an update function.
 *
 * @example
 * ```js
 * const [vars, setVars] = useCssVars({
 *     primary: "#3498db",
 *     spacing: "1rem"
 * });
 *
 * element.style.color = vars.primary;
 *
 * setVars({
 *     primary: "#e74c3c"
 * });
 *
 * setVars(current => ({
 *     ...current,
 *     spacing: "2rem"
 * }));
 * ```
 *
 * @example
 * ```js
 * const [vars, setVars] = useCssVars(
 *     { primary: "blue" },
 *     {
 *         namespace: "app",
 *         target: document.querySelector("#app")
 *     }
 * );
 * ```
 */
export declare function useCssVars(
    initialData: CssVarsData,
    options?: UseCssVarsOptions
): UseCssVarsResult;