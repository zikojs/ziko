import { describe, it, expect } from 'vitest';

import {
  camel2hyphencase,
  camel2snakecase,
  camel2pascalcase,
  camel2constantcase,

  pascal2snakecase,
  pascal2hyphencase,
  pascal2camelcase,
  pascal2constantcase,

  snake2camelcase,
  snake2hyphencase,
  snake2pascalcase,
  snake2constantcase,

  hyphen2camelcase,
  hyphen2snakecase,
  hyphen2pascalcase,
  hyphen2constantcase,

  constant2camelcase,
  constant2snakecase,
  constant2pascalcase,
  constant2hyphencase
} from 'ziko/string/converters';

describe('Case Conversion Utilities', () => {
  describe('camelCase', () => {
    it('should convert camelCase to other formats', () => {
      expect(camel2hyphencase('camelCase')).toBe('camel-case');
      expect(camel2snakecase('camelCase')).toBe('camel_case');
      expect(camel2pascalcase('camelCase')).toBe('CamelCase');
      expect(camel2constantcase('camelCase')).toBe('CAMEL_CASE');
    });

    it('should handle a leading uppercase character', () => {
      expect(camel2hyphencase('CamelCase')).toBe('camel-case');
      expect(camel2snakecase('CamelCase')).toBe('camel_case');
      expect(camel2pascalcase('CamelCase')).toBe('CamelCase');
      expect(camel2constantcase('CamelCase')).toBe('CAMEL_CASE');
    });

    it('should handle single words', () => {
      expect(camel2hyphencase('camel')).toBe('camel');
      expect(camel2snakecase('camel')).toBe('camel');
      expect(camel2pascalcase('camel')).toBe('Camel');
      expect(camel2constantcase('camel')).toBe('CAMEL');
    });

    it('should handle empty strings', () => {
      expect(camel2hyphencase()).toBe('');
      expect(camel2snakecase()).toBe('');
      expect(camel2pascalcase()).toBe('');
      expect(camel2constantcase()).toBe('');
    });
  });

  describe('PascalCase', () => {
    it('should convert PascalCase to other formats', () => {
      expect(pascal2snakecase('PascalCase')).toBe('pascal_case');
      expect(pascal2hyphencase('PascalCase')).toBe('pascal-case');
      expect(pascal2camelcase('PascalCase')).toBe('pascalCase');
      expect(pascal2constantcase('PascalCase')).toBe('PASCAL_CASE');
    });

    it('should handle single words', () => {
      expect(pascal2snakecase('Pascal')).toBe('pascal');
      expect(pascal2hyphencase('Pascal')).toBe('pascal');
      expect(pascal2camelcase('Pascal')).toBe('pascal');
      expect(pascal2constantcase('Pascal')).toBe('PASCAL');
    });

    it('should handle empty strings', () => {
      expect(pascal2snakecase()).toBe('');
      expect(pascal2hyphencase()).toBe('');
      expect(pascal2camelcase()).toBe('');
      expect(pascal2constantcase()).toBe('');
    });
  });

  describe('snake_case', () => {
    it('should convert snake_case to other formats', () => {
      expect(snake2camelcase('snake_case')).toBe('snakeCase');
      expect(snake2hyphencase('snake_case')).toBe('snake-case');
      expect(snake2pascalcase('snake_case')).toBe('SnakeCase');
      expect(snake2constantcase('snake_case')).toBe('SNAKE_CASE');
    });

    it('should handle multiple words', () => {
      expect(snake2camelcase('hello_world_test')).toBe('helloWorldTest');
      expect(snake2hyphencase('hello_world_test')).toBe('hello-world-test');
      expect(snake2pascalcase('hello_world_test')).toBe('HelloWorldTest');
      expect(snake2constantcase('hello_world_test')).toBe('HELLO_WORLD_TEST');
    });

    it('should handle a single word', () => {
      expect(snake2camelcase('snake')).toBe('snake');
      expect(snake2hyphencase('snake')).toBe('snake');
      expect(snake2pascalcase('snake')).toBe('Snake');
      expect(snake2constantcase('snake')).toBe('SNAKE');
    });
  });

  describe('hyphen-case', () => {
    it('should convert hyphen-case to other formats', () => {
      expect(hyphen2camelcase('hyphen-case')).toBe('hyphenCase');
      expect(hyphen2snakecase('hyphen-case')).toBe('hyphen_case');
      expect(hyphen2pascalcase('hyphen-case')).toBe('HyphenCase');
      expect(hyphen2constantcase('hyphen-case')).toBe('HYPHEN_CASE');
    });

    it('should handle multiple words', () => {
      expect(hyphen2camelcase('hello-world-test')).toBe('helloWorldTest');
      expect(hyphen2snakecase('hello-world-test')).toBe('hello_world_test');
      expect(hyphen2pascalcase('hello-world-test')).toBe('HelloWorldTest');
      expect(hyphen2constantcase('hello-world-test')).toBe('HELLO_WORLD_TEST');
    });

    it('should handle a single word', () => {
      expect(hyphen2camelcase('hyphen')).toBe('hyphen');
      expect(hyphen2snakecase('hyphen')).toBe('hyphen');
      expect(hyphen2pascalcase('hyphen')).toBe('Hyphen');
      expect(hyphen2constantcase('hyphen')).toBe('HYPHEN');
    });
  });

  describe('CONSTANT_CASE', () => {
    it('should convert CONSTANT_CASE to other formats', () => {
      expect(constant2camelcase('CONSTANT_CASE')).toBe('constantCase');
      expect(constant2snakecase('CONSTANT_CASE')).toBe('constant_case');
      expect(constant2pascalcase('CONSTANT_CASE')).toBe('ConstantCase');
      expect(constant2hyphencase('CONSTANT_CASE')).toBe('constant-case');
    });

    it('should handle multiple words', () => {
      expect(constant2camelcase('HELLO_WORLD_TEST')).toBe('helloWorldTest');
      expect(constant2snakecase('HELLO_WORLD_TEST')).toBe('hello_world_test');
      expect(constant2pascalcase('HELLO_WORLD_TEST')).toBe('HelloWorldTest');
      expect(constant2hyphencase('HELLO_WORLD_TEST')).toBe('hello-world-test');
    });

    it('should handle a single word', () => {
      expect(constant2camelcase('CONSTANT')).toBe('constant');
      expect(constant2snakecase('CONSTANT')).toBe('constant');
      expect(constant2pascalcase('CONSTANT')).toBe('Constant');
      expect(constant2hyphencase('CONSTANT')).toBe('constant');
    });
  });
});