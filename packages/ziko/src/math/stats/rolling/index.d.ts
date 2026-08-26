/**
 * Calculates the Simple Moving Average (SMA).
 *
 * SMA computes the average value over a fixed-size sliding window.
 *
 * @param X Input dataset.
 * @param w Window size.
 *
 * @example
 * sma([1, 2, 3, 4, 5], 3) // [2, 3, 4]
 */
export declare function sma(
    X: number[],
    w: number
): number[];

/**
 * Calculates the Exponential Moving Average (EMA).
 *
 * EMA gives more weight to recent observations using a smoothing factor.
 *
 * @param X Input dataset.
 * @param alpha Smoothing factor between 0 and 1.
 *
 * @example
 * ema([1, 2, 3, 4], 0.5) // [1, 1.5, 2.25, 3.125]
 */
export declare function ema(
    X: number[],
    alpha: number
): number[];

/**
 * Calculates the Weighted Moving Average (WMA).
 *
 * Each value in the moving window is multiplied by its corresponding weight.
 *
 * @param X Input dataset.
 * @param weights Weights applied to each value in the window.
 *
 * @example
 * wma([1, 2, 3, 4], [1, 2]) // [1.66..., 2.66..., 3.66...]
 */
export declare function wma(
    X: number[],
    weights: number[]
): number[];