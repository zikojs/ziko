/**
 * Calculates a percentile of a dataset.
 *
 * The percentile value represents the point below which a given
 * percentage of observations fall.
 *
 * @param X Input dataset.
 * @param p Percentile value between 0 and 100.
 *
 * @example
 * percentile([1, 2, 3, 4], 50) // 2.5
 */
export declare function percentile(
    X: number[],
    p: number
): number;

/**
 * Calculates the first quartile (25th percentile).
 *
 * @param X Input dataset.
 *
 * @example
 * q1([1, 2, 3, 4]) // 1.75
 */
export declare function q1(
    X: number[]
): number;

/**
 * Calculates the median (50th percentile).
 *
 * @param X Input dataset.
 *
 * @example
 * median([1, 2, 3, 4]) // 2.5
 */
export declare function median(
    X: number[]
): number;

/**
 * Calculates the third quartile (75th percentile).
 *
 * @param X Input dataset.
 *
 * @example
 * q3([1, 2, 3, 4]) // 3.25
 */
export declare function q3(
    X: number[]
): number;

/**
 * Calculates the interquartile range (IQR).
 *
 * The IQR is the difference between the third quartile and first quartile.
 *
 * Formula:
 * IQR = Q3 - Q1
 *
 * @param X Input dataset.
 */
export declare function iqr(
    X: number[]
): number;