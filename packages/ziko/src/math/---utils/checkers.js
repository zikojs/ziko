/** @module Math */
/**
 * Checks if a value is within the specified range.
 * @function
 * @param {number} x - The value to check.
 * @param {number} a - The start of the range.
 * @param {number} b - The end of the range.
 * @returns {boolean} Returns true if the value is within the range [a, b], otherwise false.
 */
const inRange = (x, a, b) => {
    const [min, max] = [Math.min(a, b), Math.max(a, b)];
    return x >= min && x <= max;
}

/**
 * Checks if two numbers are approximately equal within a given error margin.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @param {number} [Err=0.0001] - The maximum acceptable difference between the two numbers.
 * @returns {boolean} Returns true if the two numbers are approximately equal within the specified error margin, otherwise false.
 */
const isApproximatlyEqual = (a, b, Err = 0.0001) => {
    return Math.abs(a - b) <= Err;
}

export {
    inRange,
    isApproximatlyEqual
}
