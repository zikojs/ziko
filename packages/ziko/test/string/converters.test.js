import { describe, it, expect } from 'vitest';
import { 
    camel2hyphencase, camel2snakecase, camel2pascalcase, camel2constantcase,
    pascal2snakecase, pascal2hyphencase, pascal2camelcase, pascal2constantcase,
    snake2camelcase, snake2hyphencase, snake2pascalcase, snake2constantcase,
    hyphen2camelcase, hyphen2snakecase, hyphen2pascalcase, hyphen2constantcase,
    constant2camelcase, constant2snakecase, constant2pascalcase, constant2hyphencase 
} from 'ziko/string/converters';

describe('Case Conversion Utilities', () => {
    it('should convert camelCase to other formats', () => {
        expect(camel2hyphencase('camelCase')).toBe('camel-case');
        expect(camel2snakecase('camelCase')).toBe('camel_case');
        expect(camel2pascalcase('camelCase')).toBe('CamelCase');
        expect(camel2constantcase('camelCase')).toBe('CAMEL_CASE');
    });

    it('should convert PascalCase to other formats', () => {
        expect(pascal2snakecase('PascalCase')).toBe('pascal_case');
        expect(pascal2hyphencase('PascalCase')).toBe('pascal-case');
        expect(pascal2camelcase('PascalCase')).toBe('pascalCase');
        expect(pascal2constantcase('PascalCase')).toBe('PASCAL_CASE');
    });

    it('should convert snake_case to other formats', () => {
        expect(snake2camelcase('snake_case')).toBe('snakeCase');
        expect(snake2hyphencase('snake_case')).toBe('snake-case');
        expect(snake2pascalcase('snake_case')).toBe('SnakeCase');
        expect(snake2constantcase('snake_case')).toBe('SNAKE_CASE');
    });

    it('should convert hyphen-case to other formats', () => {
        expect(hyphen2camelcase('hyphen-case')).toBe('hyphenCase');
        expect(hyphen2snakecase('hyphen-case')).toBe('hyphen_case');
        expect(hyphen2pascalcase('hyphen-case')).toBe('HyphenCase');
        expect(hyphen2constantcase('hyphen-case')).toBe('HYPHEN_CASE');
    });

    it('should convert CONSTANT_CASE to other formats', () => {
        expect(constant2camelcase('CONSTANT_CASE')).toBe('constantCase');
        expect(constant2snakecase('CONSTANT_CASE')).toBe('constant_case');
        expect(constant2pascalcase('CONSTANT_CASE')).toBe('ConstantCase');
        expect(constant2hyphencase('CONSTANT_CASE')).toBe('constant-case');
    });
});