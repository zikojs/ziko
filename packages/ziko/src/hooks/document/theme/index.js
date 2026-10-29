
import { useCssVars } from '../css-vars/index.js';

export function useTheme(themes, {
    defaultTheme = Object.keys(themes ?? {})[0],
    namespace = 'ziko',
    validCssProps = false,
    target = globalThis.document,
} = {}) {
    if (
        !themes ||
        typeof themes !== 'object' ||
        Array.isArray(themes) ||
        Object.keys(themes).length === 0
    ) throw new TypeError('themes must be a non-empty object');
    if (!Object.hasOwn(themes, defaultTheme)) {
        throw new Error(`Unknown default theme: '${defaultTheme}'`);
    }

    for (const [name, theme] of Object.entries(themes)) {
        if (!theme || typeof theme !== 'object' || Array.isArray(theme)) {
            throw new TypeError(`Theme '${name}' must be an object`);
        }
    }

    validateThemeSchema(themes, defaultTheme);

    const [vars, setVars] = useCssVars(themes[defaultTheme], {
        namespace,
        validCssProps,
        target
    });

    let activeTheme = defaultTheme;

    const setTheme = (name) => {
        if (!Object.hasOwn(themes, name)) throw new Error(`Unknown theme: '${name}'`);
        setVars(themes[name]);
        activeTheme = name;
        return vars;
    };

    const getTheme = () => activeTheme;
    return [vars, setTheme, getTheme];
}

function validateThemeSchema(themes, defaultTheme) {
    const referenceKeys = Object.keys(themes[defaultTheme]).sort();
    for (const [name, theme] of Object.entries(themes)) {
        if (!theme || typeof theme !== 'object' || Array.isArray(theme)) {
            throw new TypeError(`Theme '${name}' must be an object`);
        }
        const keys = Object.keys(theme).sort();
        if ( keys.length !== referenceKeys.length || keys.some((key, index) => key !== referenceKeys[index])) {
            const missing = referenceKeys.filter( key => !Object.hasOwn(theme, key));
            const extra = keys.filter(key => !referenceKeys.includes(key));
            const details = [
                missing.length && `missing: ${missing.join(', ')}`,
                extra.length && `unexpected: ${extra.join(', ')}`
            ].filter(Boolean).join('; ');
            throw new Error(`Theme '${name}' has an invalid schema (${details})`);
        }
    }
    return true;
}