import { Mappable } from "../mapfun/index.d.ts";
/**
 * Converts degrees to radians.
 *
 * Accepts multiple values and recursively maps through
 * supported structures.
 *
 * @example
 * deg2rad(180) // 3.14159...
 */
export declare function deg2rad(
    ...deg: Mappable<number>[]
): Mappable<number>;

/**
 * Converts radians to degrees.
 *
 * Accepts multiple values and recursively maps through
 * supported structures.
 *
 * @example
 * rad2deg(Math.PI) // 180
 */
export declare function rad2deg(
    ...rad: Mappable<number>[]
): Mappable<number>;

/**
 * Normalizes a value from a range to the interval [0, 1].
 *
 * Supports numbers, arrays, typed arrays, objects,
 * complex values and matrices.
 *
 * @param x Input value.
 * @param min Minimum range value.
 * @param max Maximum range value.
 */
export declare function norm(
    x: Mappable<number>,
    min: number,
    max: number
): Mappable<number>;

/**
 * Performs linear interpolation.
 *
 * Maps a normalized value to a given range.
 *
 * @param x Input normalized value.
 * @param min Start value.
 * @param max End value.
 */
export declare function lerp(
    x: Mappable<number>,
    min: number,
    max: number
): Mappable<number>;

/**
 * Restricts values to a given interval.
 *
 * @param x Input value.
 * @param min Lower bound.
 * @param max Upper bound.
 */
export declare function clamp(
    x: Mappable<number>,
    min: number,
    max: number
): Mappable<number>;

/**
 * Maps a value from one range to another.
 *
 * @param x Input value.
 * @param a Source minimum.
 * @param b Source maximum.
 * @param c Target minimum.
 * @param d Target maximum.
 */
export declare function map(
    x: Mappable<number>,
    a: number,
    b: number,
    c: number,
    d: number
): Mappable<number>;

/**
 * Calculates the Euclidean norm (hypotenuse).
 *
 * Supports numbers and complex-like values.
 *
 * @example
 * hypot(3, 4) // 5
 */
export declare function hypot(
    ...x: (number | ComplexLike)[]
): number;

/**
 * Calculates the angle between the positive x-axis and a point.
 *
 * Supports scalar values and array inputs.
 *
 * @param y Y coordinate(s).
 * @param x X coordinate(s).
 * @param rad Return radians when true, degrees otherwise.
 *
 * @example
 * atan2(1, 1) // 0.785...
 * atan2(1, 1, false) // 45
 */
export declare function atan2(
    y: Mappable<number>,
    x: Mappable<number>,
    rad?: boolean
): Mappable<number>;