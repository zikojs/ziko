export type ThemeValue = string | number | boolean;

export type Theme = Record<string, ThemeValue>;

export type Themes = Record<string, Theme>;

export interface UseThemeOptions {
    /** Theme applied initially. Defaults to the first theme key. */
    defaultTheme?: string;

    /** CSS variable namespace. Defaults to "ziko". */
    namespace?: string;

    /** Validate CSS property names. Defaults to false. */
    validCssProps?: boolean;

    /** Document or Element where CSS variables are applied. */
    target?: Document | Element;

}

export type ThemeVariables = Record<string, string>;

export type SetTheme = (name: string) => ThemeVariables;

export type GetTheme = () => string;

/**
 * Creates a theme manager backed by CSS custom properties.
 *
 * @param themes - Available themes, each containing the same properties.
 * @param options - Theme configuration options.
 * @returns A tuple containing CSS variable references, a theme setter,
 * and a getter for the active theme name.
 *
 * @example
 * ```ts
 * const [vars, setTheme, getTheme] = useTheme({
 *   light: {
 *     background: "#ffffff",
 *     color: "#000000"
 *   },
 *   dark: {
 *     background: "#181818",
 *     color: "#ffffff"
 *   }
 * });
 *
 * document.body.style.background = vars.background;
 *
 * setTheme("dark");
 * console.log(getTheme()); // "dark"
 * ```
 */
export declare function useTheme(
    themes: Themes,
    options?: UseThemeOptions
): [
    vars: ThemeVariables,
    setTheme: SetTheme,
    getTheme: GetTheme
];