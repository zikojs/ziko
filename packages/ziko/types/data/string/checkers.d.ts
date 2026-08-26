// stringUtils.d.ts

/**
 * Checks if a string is in camelCase.
 * @param text The string to check. Defaults to empty string.
 * @returns True if the string is camelCase, false otherwise.
 */
export function is_camelcase(text?: string): boolean;

/**
 * Checks if a string contains hyphens (hyphen-case).
 * @param text The string to check. Defaults to empty string.
 * @returns True if the string contains hyphens, false otherwise.
 */
export function is_hyphencase(text?: string): boolean;

/**
 * Checks if a string contains underscores (snake_case).
 * @param text The string to check. Defaults to empty string.
 * @returns True if the string contains underscores, false otherwise.
 */
export function is_snakeCase(text?: string): boolean;

/**
 * Checks if a string is in PascalCase.
 * @param text The string to check. Defaults to empty string.
 * @returns True if the string is PascalCase, false otherwise.
 */
export function is_pascalcalse(text?: string): boolean;

/**
 * Checks if a string is a palindrome (case-insensitive).
 * @param text The string to check.
 * @returns True if the string is a palindrome, false otherwise.
 */
export function is_palindrome(text: string): boolean;

/**
 * Checks if two words are anagrams of each other.
 * @param word The first word.
 * @param words The second word.
 * @returns True if the words are anagrams, false otherwise.
 */
export function is_anagram(word: string, words: string): boolean;

/**
 * Checks if a string is an isogram (no repeating letters, case-insensitive).
 * @param text The string to check. Defaults to empty string.
 * @returns True if the string is an isogram, false otherwise.
 */
export function is_isogram(text?: string): boolean;
