/**
 * Calculates the population variance.
 *
 * Variance measures how far values are spread from their mean.
 *
 * @example
 * variance(1, 2, 3) // 0.666...
 */
export declare function variance(
    ...x: number[]
): number;

/**
 * Calculates the population standard deviation.
 *
 * @example
 * std(1, 2, 3) // 0.816...
 */
export declare function std(
    ...x: number[]
): number;

/**
 * Calculates the sample variance.
 *
 * Uses Bessel's correction (n - 1) for an unbiased estimator.
 *
 * @example
 * sample_variance(1, 2, 3) // 1
 */
export declare function sample_variance(
    ...x: number[]
): number;

/**
 * Calculates the sample standard deviation.
 *
 * @example
 * sample_std(1, 2, 3) // 1
 */
export declare function sample_std(
    ...x: number[]
): number;

/**
 * Calculates the weighted variance.
 *
 * @param X Input dataset.
 * @param weights Weight associated with each value.
 *
 * @example
 * weighted_variance([1, 2, 3], [1, 2, 1]) // 0.5
 */
export declare function weighted_variance(
    X: number[],
    weights: number[]
): number;

/**
 * Calculates the weighted standard deviation.
 *
 * @param X Input dataset.
 * @param weights Weight associated with each value.
 */
export declare function weighted_std(
    X: number[],
    weights: number[]
): number;

/**
 * Calculates rolling sample variance over a sliding window.
 *
 * @param X Input dataset.
 * @param windowSize Number of elements in each window.
 *
 * @example
 * rolling_variance([1, 2, 3, 4], 3) // [1, 1, 1]
 */
export declare function rolling_variance(
    X: number[],
    windowSize: number
): number[];

/**
 * Calculates rolling standard deviation over a sliding window.
 *
 * @param X Input dataset.
 * @param windowSize Number of elements in each window.
 */
export declare function rolling_std(
    X: number[],
    windowSize: number
): number[];