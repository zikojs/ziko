import { describe, it, expect } from 'vitest';
import { mapfun, apply_fun } from 'ziko/math/mapfun';

describe('mapfun', () => {
    it('should map over primitives correctly', () => {
        expect(mapfun(x => x * 2, 5)).toBe(10);
    });

    it('should map over multiple arguments and return an array', () => {
        expect(mapfun(x => x * 2, 2, 3, 4)).toEqual([4, 6, 8]);
    });

    it('should map over nested arrays recursively', () => {
        const input = [1, [2, [3, 4]], 5];
        const result = mapfun(x => x + 1, input);
        expect(result).toEqual([2, [3, [4, 5]], 6]);
    });

    it('should map over TypedArrays', () => {
        const typedArr = Float32Array.from([1, 2, 3]);
        const result = mapfun(x => x * 10, typedArr);
        expect(result).toEqual(Float32Array.from([10, 20, 30]));
    });

    it('should map over Sets', () => {
        const set = new Set([1, 2, 3]);
        const result = mapfun(x => x * 2, set);
        expect(result).toEqual(new Set([2, 4, 6]));
    });

    it('should map over Map values while keeping keys intact', () => {
        const map = new Map([['a', 1], ['b', 2]]);
        const result = mapfun(x => x * 10, map);
        expect(result).toEqual(new Map([['a', 10], ['b', 20]]));
    });

    it('should map over plain objects and nested properties', () => {
        const obj = { a: 1, b: { c: 2, d: [3, 4] } };
        const result = mapfun(x => x + 1, obj);
        expect(result).toEqual({ a: 2, b: { c: 3, d: [4, 5] } });
    });
});

describe('apply_fun', () => {
    it('should apply function to a primitive value', () => {
        expect(apply_fun(5, x => x * 3)).toBe(15);
    });

    it('should apply function to a Complex number object', () => {
        const mockComplex = {
            isComplex: () => true,
            a: 2,
            b: 4,
            constructor: function(real, imag) {
                this.a = real;
                this.b = imag;
                this.isComplex = () => true;
            }
        };
        const result = apply_fun(mockComplex, x => x + 1);
        expect(result.a).toBe(3);
        expect(result.b).toBe(5);
        expect(result.isComplex()).toBe(true);
    });

    it('should apply function to a Matrix object', () => {
        const mockMatrix = {
            isMatrix: () => true,
            rows: 1,
            cols: 2,
            arr: [[10, 20]],
            constructor: function(rows, cols, arr) {
                this.rows = rows;
                this.cols = cols;
                this.arr = [arr];
                this.isMatrix = () => true;
            }
        };
        const result = apply_fun(mockMatrix, x => x / 2);
        expect(result.arr).toEqual([[5, 10]]);
        expect(result.rows).toBe(1);
        expect(result.cols).toBe(2);
    });

    it('should process array inputs via mapfun', () => {
        const arr = [1, 2, 3];
        const result = apply_fun(arr, x => x * 10);
        expect(result).toEqual([10, 20, 30]);
    });
});