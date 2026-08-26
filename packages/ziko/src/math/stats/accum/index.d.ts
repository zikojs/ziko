 /**
  * Calculates the cumulative sum of an array.
  *
  * Each element in the returned array represents the sum of all
  * previous elements up to the current index.
  *
  * @example
  * accum_sum([1, 2, 3]) // [1, 3, 6]
  */
export declare function accum_sum(arr: number[]): number[];

/**
 * Calculates the cumulative product of an array.
 *
 * Each element in the returned array represents the product of all
 * previous elements up to the current index.
 *
 * @example
 * accum_product([2, 3, 4]) // [2, 6, 24]
 */
export declare function accum_product(arr: number[]): number[];

/**
 * Calculates the cumulative maximum values of an array.
 *
 * Each element in the returned array represents the maximum value
 * encountered from the beginning of the array.
 *
 * @example
 * accum_max([3, 1, 5, 2]) // [3, 3, 5, 5]
 */
export declare function accum_max(arr: number[]): number[];

/**
 * Calculates the cumulative minimum values of an array.
 *
 * Each element in the returned array represents the minimum value
 * encountered from the beginning of the array.
 *
 * @example
 * accum_min([3, 1, 5, 2]) // [3, 1, 1, 1]
 */
export declare function accum_min(arr: number[]): number[];