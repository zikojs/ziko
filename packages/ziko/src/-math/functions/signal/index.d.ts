import type { Complex }from '../../complex/index.d.ts'
/**
 * Creates an array filled with zeros.
 *
 * @param n Array length.
 */
export declare function zeros(
    n: number
): number[];

/**
 * Creates an array filled with ones.
 *
 * @param n Array length.
 */
export declare function ones(
    n: number
): number[];

/**
 * Creates an array filled with a given value.
 *
 * @param n Array length.
 * @param num Fill value.
 */
export declare function nums<T>(
    n: number,
    num: T
): T[];


/**
 * Creates a range of numbers.
 *
 * Supports ascending and descending ranges.
 *
 * @param a Start value.
 * @param b End value.
 * @param step Step size.
 * @param include Include end value.
 *
 * @example
 * arange(0, 5, 1)
 * // [0,1,2,3,4]
 */
export declare function arange(
    a: number,
    b: number,
    step: number,
    include?: boolean
): number[];

export declare function arange(
    a: number[],
    b: number,
    step: number,
    include?: boolean
): number[][];

export declare function arange(
    a: number,
    b: number[],
    step: number,
    include?: boolean
): number[][];

export declare function arange(
    a: number[],
    b: number[],
    step: number,
    include?: boolean
): number[][];


/**
 * Generates evenly spaced numbers over an interval.
 *
 * @param a Start value.
 * @param b End value.
 * @param n Number of samples.
 * @param endpoint Include endpoint.
 */
export declare function linspace(
    a: number,
    b: number,
    n?: number,
    endpoint?: boolean
): number[];

export declare function linspace<T extends Complex>(
    a: number | T,
    b: number | T,
    n?: number,
    endpoint?: boolean
): T[];

export declare function linspace(
    a: number[],
    b: number | number[],
    n?: number,
    endpoint?: boolean
): number[][];


/**
 * Generates numbers spaced evenly on a logarithmic scale.
 *
 * @param a Start exponent.
 * @param b End exponent.
 * @param n Number of samples.
 * @param base Logarithm base.
 * @param endpoint Include endpoint.
 */
export declare function logspace(
    a: number,
    b: number,
    n?: number,
    base?: number,
    endpoint?: boolean
): number[];


/**
 * Generates numbers spaced evenly on a geometric progression.
 *
 * @param a Start value.
 * @param b End value.
 * @param n Number of samples.
 * @param endpoint Include endpoint.
 * @param precision Decimal precision.
 */
export declare function geomspace(
    a: number,
    b: number,
    n?: number,
    endpoint?: boolean,
    precision?: number
): number[];

export declare function geomspace<T extends Complex>(
    a: T | number,
    b: T | number,
    n?: number,
    endpoint?: boolean,
    precision?: number
): T[];