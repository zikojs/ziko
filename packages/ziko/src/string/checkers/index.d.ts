/**
 * Checks if a string follows camelCase notation.
 *
 * @param text - The string to check.
 * @returns `true` if the string is camelCase, otherwise `false`.
 */
export declare const is_camelcase: (text?: string) => boolean;

/**
 * Checks if a string follows kebab-case (hyphen-case) notation.
 *
 * @param text - The string to check.
 * @returns `true` if the string contains a hyphen separator, otherwise `false`.
 */
export declare const is_hyphencase: (text?: string) => boolean;

/**
 * Checks if a string follows snake_case notation.
 *
 * @param text - The string to check.
 * @returns `true` if the string contains an underscore separator, otherwise `false`.
 */
export declare const is_snakeCase: (text?: string) => boolean;

/**
 * Checks if a string follows PascalCase notation.
 *
 * @param text - The string to check.
 * @returns `true` if the string is PascalCase, otherwise `false`.
 */
export declare const is_pascalcase: (text?: string) => boolean;

/**
 * Checks whether a string is a palindrome.
 *
 * A palindrome is a string that reads the same forward and backward.
 *
 * @param text - The string to check.
 * @returns `true` if the string is a palindrome, otherwise `false`.
 */
export declare const is_palindrome: (text: string) => boolean;

/**
 * Checks whether two words are anagrams.
 *
 * Two words are anagrams if they contain the same characters with the same frequency.
 *
 * @param word - The first word.
 * @param words - The second word to compare with.
 * @returns `true` if both words are anagrams, otherwise `false`.
 */
export declare const is_anagram: (word: string, words: string) => boolean;

/**
 * Checks whether a string is an isogram.
 *
 * An isogram is a word with no repeating characters.
 *
 * @param text - The string to check.
 * @returns `true` if the string has no repeated characters, otherwise `false`.
 */
export declare const is_isogram: (text?: string) => boolean;