import { describe, it, expect } from 'vitest';
import { add, sub, mul, div, modulo } from 'ziko/math/arithmetic';

describe('Arithmetic Utilities', () => {
    it('should perform basic number arithmetic with multiple arguments', () => {
        expect(add(1, 2, 3)).toBe(6);
        expect(sub(10, 3, 2)).toBe(5);
        expect(mul(2, 3, 4)).toBe(24);
        expect(div(24, 2, 3)).toBe(4);
        expect(modulo(10, 3)).toBe(1);
    });

    it('should handle number and complex number interactions', () => {
        const mockComplex = {
            isComplex: () => true,
            constructor: function(real, imag) {
                this.real = real;
                this.imag = imag;
                this.isComplex = () => true;
                this.add = function(y) {
                    return { real: this.real + y.real, imag: this.imag + y.imag, isComplex: () => true };
                };
            }
        };
        
        const c = new mockComplex.constructor(5, 2);
        const result = add(2, c); // converts 2 to complex(2,0), then calls add
        expect(result.real).toBe(7);
    });

    it('should handle number and matrix interactions', () => {
        const mockNumsMatrix = {
            isMatrix: () => true,
            add(y) { return { ...this, evaluated: true }; }
        };

        const mockMatrix = {
            isMatrix: () => true,
            rows: 2,
            cols: 2,
            constructor: {
                nums: (rows, cols, val) => mockNumsMatrix
            }
        };

        const result = add(5, mockMatrix);
        expect(result.evaluated).toBe(true);
    });
});