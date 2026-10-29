
export type CssVarsData = Record<string, string | number | boolean>;

export type CssVarsUpdater = (
    previous: CssVarsData
) => Partial<CssVarsData>;

export interface CssVarsOptions {
    /**
     * Prefix used for CSS custom properties.
     *
     * @default "ziko"
     *
     * @example
     * namespace: "app" // --app-color
     */
    namespace?: string;

    /**
     * Validates property names against CSSStyleDeclaration.
     *
     * @default false
     */
    validCssProps?: boolean;

    /**
     * Document or Element on which CSS variables are defined.
     *
     * Defaults to the global document.
     *
     * @default document
     */
    target?: Document | Element;
}

/**
 * Creates and manages CSS custom properties.
 *
 * @param initialData Initial CSS variable values.
 * @param options Configuration options.
 *
 * @returns A tuple containing a CSS variable reference object
 * and a setter that updates the variables.
 *
 * @example
 * const [vars, setVars] = useCssVars({
 *     color: "darkblue",
 *     padding: "10px",
 *     opacity: 1
 * });
 *
 * element.style({
 *     color: vars.color,
 *     padding: vars.padding
 * });
 *
 * setVars({
 *     color: "red"
 * });
 *
 * @example
 * const container = document.querySelector("#app")!;
 *
 * const [vars, setVars] = useCssVars(
 *     { color: "blue" },
 *     {
 *         namespace: "app",
 *         target: container
 *     }
 * );
 *
 * // Defines --app-color on the container.
 */
export declare class CssVars {
    constructor(
        initialData: CssVarsData,
        options?: CssVarsOptions
    );
}

/**
 * Creates CSS variables and returns a tuple:
 * [vars, setVars].
 *
 * Accessing vars.color returns "var(--ziko-color)".
 *
 * @example
 * const [vars, setVars] = useCssVars({
 *     background: "white",
 *     color: "black",
 *     border: "1px solid gray"
 * });
 *
 * console.log(vars.border); // "var(--ziko-border)"
 *
 * setVars({
 *     color: "blue",
 *     padding: "12px"
 * });
 *
 * @example
 * // Use unprefixed CSS custom properties.
 * const [vars, setVars] = useCssVars(
 *     { color: "red" },
 *     { namespace: "" }
 * );
 *
 * // vars.color === "var(--color)"
 */
export declare function useCssVars(
    initialData: CssVarsData,
    options?: CssVarsOptions
): [
    vars: Record<string, string>,
    setVars: (
        nextData: Partial<CssVarsData> | CssVarsUpdater
    ) => Record<string, string>
];
