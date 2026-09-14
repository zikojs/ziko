import { describe, it, expect } from 'vitest';
import { 
    deg2rad, 
    rad2deg, 
    norm, 
    lerp, 
    clamp, 
    map, 
    hypot, 
    atan2 
} from 'ziko/math/utils';

describe('Math Utilities and Mapping', () => {
    it('should convert degrees to radians and vice versa', () => {
        expect(deg2rad(180)).toBeCloseTo(Math.PI);
        expect(deg2rad(90, 180)).toEqual([Math.PI / 2, Math.PI]);
        expect(rad2deg(Math.PI)).toBeCloseTo(180);
    });

    it('should normalize values correctly', () => {
        expect(norm(5, 0, 10)).toBe(0.5);
        expect(norm([0, 5, 10], 0, 10)).toEqual([0, 0.5, 1]);
        expect(norm(5, 5, 5)).toBe(0); // min === max edge case
    });

    it('should perform linear interpolation (lerp)', () => {
        expect(lerp(0.5, 0, 10)).toBe(5);
        expect(lerp([0, 1], 10, 20)).toEqual([10, 20]);
    });

    it('should clamp values within bounds', () => {
        expect(clamp(15, 0, 10)).toBe(10);
        expect(clamp(-5, 0, 10)).toBe(0);
        expect(clamp(5, 0, 10)).toBe(5);
        expect(clamp([-2, 5, 12], 0, 10)).toEqual([0, 5, 10]);
    });

    it('should map values between ranges', () => {
        expect(map(5, 0, 10, 0, 100)).toBe(50);
        expect(map([0, 5, 10], 0, 10, 100, 200)).toEqual([100, 150, 200]);
    });

    it('should compute hypotenuse for standard numbers', () => {
        expect(hypot(3, 4)).toBe(5);
        expect(hypot(5, 12)).toBe(13);
    });

    it('should compute atan2 across scalars and arrays', () => {
        expect(atan2(0, 1)).toBe(0);
        expect(atan2(1, 1, false)).toBe(45); // degrees
        expect(atan2([0, 1], 1)).toEqual([0, Math.atan2(1, 1)]);
        expect(atan2(1, [0, 1])).toEqual([Math.atan2(1, 0), Math.atan2(1, 1)]);
        expect(atan2([0, 1], [1, 1])).toEqual([Math.atan2(0, 1), Math.atan2(1, 1)]);
    });
});