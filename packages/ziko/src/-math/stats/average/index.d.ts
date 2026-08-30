/**
 * Calculates the arithmetic mean of values.
 *
 * @example
 * mean(1, 2, 3) // 2
 */
export declare function mean(...x: number[]): number;

/**
 * Calculates the geometric mean of values.
 *
 * @example
 * geo_mean(1, 4, 16) // 4
 */
export declare function geo_mean(...x: number[]): number;

/**
 * Calculates the root mean square (quadratic mean).
 *
 * @example
 * rms(3, 4) // 2.5
 */
export declare function rms(...x: number[]): number;

/**
 * Calculates the weighted arithmetic mean.
 *
 * @param values Values to average.
 * @param weights Weight associated with each value.
 *
 * @example
 * weighted_mean([10, 20], [1, 3]) // 17.5
 */
export declare function weighted_mean(
    values: number[],
    weights: number[]
): number;

/**
 * Calculates the harmonic mean of values.
 *
 * @example
 * harmonic_mean(1, 2, 4) // 1.714...
 */
export declare function harmonic_mean(...x: number[]): number;

/**
 * Calculates the generalized power mean.
 *
 * @param X Input values.
 * @param p Power parameter.
 *
 * @example
 * power_mean([1, 2, 3], 2) // 2.16...
 */
export declare function power_mean(
    X: number[],
    p: number
): number;

/**
 * Calculates the trimmed mean by removing k lowest and highest values.
 *
 * @param X Input values.
 * @param k Number of values removed from each side.
 */
export declare function trimmed_mean(
    X: number[],
    k: number
): number;

/**
 * Calculates the winsorized mean.
 *
 * Extreme values are replaced by the nearest remaining boundary values.
 *
 * @param X Input values.
 * @param k Number of values affected on each side.
 */
export declare function winsorized_mean(
    X: number[],
    k: number
): number;

/**
 * Calculates the midrange.
 *
 * The average of the minimum and maximum values.
 *
 * @example
 * midrange([1, 5, 10]) // 5.5
 */
export declare function midrange(
    x: number[]
): number;

/**
 * Calculates the midhinge.
 *
 * The average of the first and third quartiles.
 */
export declare function midhinge(
    ...x: number[]
): number;

/**
 * Calculates the interquartile mean.
 *
 * Computes the mean of values between the first and third quartiles.
 */
export declare function interquartile_mean(
    ...x: number[]
): number;

/**
 * Calculates the contraharmonic mean.
 *
 * @example
 * contraharmonic_mean(1, 2, 3) // 2.33...
 */
export declare function contraharmonic_mean(
    ...x: number[]
): number;