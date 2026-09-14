import { describe, it, expect } from 'vitest';
import { 
    is_camelcase, 
    is_hyphencase, 
    is_snakeCase, 
    is_pascalcalse, 
    is_palindrome, 
    is_anagram, 
    is_isogram 
} from 'ziko/string';

describe('String and Text Utilities', () => {
    it('should validate camelCase correctly', () => {
        expect(is_camelcase('camelCase')).toBe(true);
        expect(is_camelcase('fooBar1')).toBe(true);
        expect(is_camelcase('PascalCase')).toBe(false);
        expect(is_camelcase('snake_case')).toBe(false);
        expect(is_camelcase('')).toBe(false);
    });

    it('should validate hyphen-case and snake_case', () => {
        expect(is_hyphencase('foo-bar')).toBe(true);
        expect(is_snakeCase('foo_bar')).toBe(true);
    });

    it('should validate PascalCase correctly', () => {
        expect(is_pascalcalse('PascalCase')).toBe(true);
        expect(is_pascalcalse('FooBar')).toBe(true);
        expect(is_pascalcalse('camelCase')).toBe(false);
        expect(is_pascalcalse('')).toBe(false);
    });

    it('should detect palindromes case-insensitively', () => {
        expect(is_palindrome('Racecar')).toBe(true);
        expect(is_palindrome('madam')).toBe(true);
        expect(is_palindrome('hello')).toBe(false);
    });

    it('should detect anagrams correctly', () => {
        expect(is_anagram('listen', 'silent')).toBe(true);
        expect(is_anagram('triangle', 'integral')).toBe(true);
        expect(is_anagram('hello', 'world')).toBe(false);
    });

    it('should detect isograms correctly', () => {
        expect(is_isogram('isogram')).toBe(true);
        expect(is_isogram('Dermatoglyphics')).toBe(true);
        expect(is_isogram('programming')).toBe(false);
    });
});