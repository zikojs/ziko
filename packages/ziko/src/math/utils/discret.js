/** @module Math */
import { floor } from "../functions/index.js";

/**
 * Computes the cartesian product of two arrays.
 * @param {Array} a - The first array.
 * @param {Array} b - The second array.
 * @returns {Array} Returns an array representing the cartesian product of the input arrays.
 */
const cartesianProduct = (a, b) => a.reduce((p, x) => [...p, ...b.map((y) => [x, y])], []);

/**
 * Computes the greatest common divisor (GCD) of two numbers.
 * @param {number} n1 - The first number.
 * @param {number} n2 - The second number.
 * @returns {number} Returns the greatest common divisor of the two input numbers.
 */
const pgcd = (n1, n2) => {
    let i,
        pgcd = 1;
    if (n1 == floor(n1) && n2 == floor(n2)) {
        for (i = 2; i <= n1 && i <= n2; ++i) {
            if (n1 % i == 0 && n2 % i == 0) pgcd = i;
        }
        return pgcd;
    } else console.log("error");
}

/**
 * Computes the least common multiple (LCM) of two numbers.
 * @param {number} n1 - The first number.
 * @param {number} n2 - The second number.
 * @returns {number} Returns the least common multiple of the two input numbers.
 */
const ppcm = (n1, n2) => {
    let ppcm;
    if (n1 == floor(n1) && n2 == floor(n2)) {
        ppcm = n1 > n2 ? n1 : n2;
        while (true) {
            if (ppcm % n1 == 0 && ppcm % n2 == 0) break;
            ++ppcm;
        }
        return ppcm;
    } else console.log("error");
}

export {
    cartesianProduct,
    ppcm,
    pgcd
}
