/**
 * Represents a reactive state getter.
 */
export type StateGetter<T> = {
    value: T;
    isStateGetter: () => true;
    _subscribe: (fn: (value: T) => void) => void;
};

/**
 * Translation dictionaries indexed by language and translation key.
 *
 * @example
 * ```ts
 * const locals = {
 *     en: {
 *         hello: 'Hello',
 *         welcome: 'Welcome!'
 *     },
 *     fr: {
 *         hello: 'Bonjour',
 *         welcome: 'Bienvenue !'
 *     }
 * };
 * ```
 */
export type I18nLocals = Record<string, Record<string, string>>;

/**
 * Returns a reactive translation getter for the specified key.
 *
 * @param key - Translation key.
 * @returns A function returning a reactive state getter.
 *
 * @example
 * ```ts
 * const greeting = t('hello');
 *
 * console.log(greeting().value);
 * // 'Hello'
 *
 * greeting()._subscribe(value => {
 *     console.log(value);
 * });
 * ```
 */
export type TranslationGetter = (
    key: string
) => () => StateGetter<string>;

/**
 * Changes the current language and document direction.
 *
 * @param lang - Language code.
 * @param rtl - Whether to enable right-to-left direction.
 *
 * @example
 * ```ts
 * setLang('fr');
 * setLang('ar', true);
 * ```
 */
export type SetLanguage = (
    lang: string,
    rtl?: boolean
) => void;

/**
 * Registers the global i18n provider.
 *
 * @param lang - Initial language.
 * @param locals - Translation dictionaries.
 *
 * @example
 * ```ts
 * createI18nProvider('en', {
 *     en: { hello: 'Hello' },
 *     fr: { hello: 'Bonjour' },
 *     ar: { hello: 'مرحبا' }
 * });
 * ```
 */
export declare function createI18nProvider(
    lang: string,
    locals: I18nLocals
): void;

/**
 * Creates a reactive translation system.
 *
 * Uses the registered global i18n provider by default.
 *
 * @param initialLang - Initial language. Defaults to the provider language.
 * @param locals - Translation dictionaries. Defaults to the provider dictionaries.
 * @returns A tuple containing the translation function and language setter.
 *
 * @example
 * ```ts
 * const [t, setLang] = useTranslation();
 *
 * console.log(t('hello')().value);
 *
 * setLang('fr');
 * console.log(t('hello')().value);
 * ```
 *
 * @example
 * ```ts
 * const [t, setLang] = useTranslation('en', {
 *     en: { hello: 'Hello' },
 *     fr: { hello: 'Bonjour' }
 * });
 *
 * setLang('fr');
 * ```
 */
export declare function useTranslation(
    initialLang?: string,
    locals?: I18nLocals
): [TranslationGetter, SetLanguage];