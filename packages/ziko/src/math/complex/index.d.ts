import type { Matrix } from "../matrix/index.js";

/**
 * Represents a complex number.
 *
 * A complex number is represented as:
 * a + bi
 */
export declare class Complex {
    a: number;
    b: number;

    constructor(a?: number, b?: number);
    constructor(c: Complex);
    constructor(value:
        | { a: number; b: number }
        | { a: number; z: number }
        | { a: number; phi: number }
        | { b: number; z: number }
        | { b: number; phi: number }
        | { z: number; phi: number }
    );

    /**
     * Used by mapfun to identify complex values.
     */
    readonly __mapfun__: boolean;

    /**
     * Checks whether this value is a Complex instance.
     */
    isComplex(): true;

    /**
     * Converts the complex number to a string.
     */
    toString(): string;

    /**
     * Serializes the complex number.
     */
    serialize(): string;

    /**
     * Deserializes a serialized complex number.
     */
    static deserialize(json: string | object): Complex | TypeError;

    /**
     * Rounds real and imaginary parts.
     *
     * @param n Number of decimal digits.
     */
    toFixed(n: number): this;

    /**
     * Formats real and imaginary parts with precision.
     *
     * @param n Number of significant digits.
     */
    toPrecision(n: number): this;

    /**
     * Creates a copy of this complex number.
     */
    clone(): Complex;

    /**
     * Magnitude of the complex number.
     */
    readonly z: number;

    /**
     * Phase angle in radians.
     */
    readonly phi: number;

    /**
     * Complex conjugate.
     */
    readonly conj: Complex;

    /**
     * Multiplicative inverse.
     */
    readonly inv: Complex;

    /**
     * Exponential representation [magnitude, phase].
     */
    readonly expo: [number, number];

    /**
     * Adds complex numbers.
     */
    add(...c: (number | Complex)[]): this;

    /**
     * Subtracts complex numbers.
     */
    sub(...c: (number | Complex)[]): this;

    /**
     * Multiplies complex numbers.
     */
    mul(...c: (number | Complex)[]): this;

    /**
     * Divides complex numbers.
     */
    div(...c: (number | Complex)[]): this;

    /**
     * Computes modulo.
     */
    modulo(...c: (number | Complex)[]): this;

    /**
     * Raises the complex number to a power.
     */
    pow(...c: (number | Complex)[]): this;

    /**
     * Calculates the nth root.
     */
    nthr(n?: number): Complex;

    /**
     * Square root.
     */
    readonly sqrt: Complex;

    /**
     * Cube root.
     */
    readonly cbrt: Complex;

    /**
     * Complex logarithm.
     */
    readonly log: Complex;

    /**
     * Complex cosine.
     */
    readonly cos: Complex;

    /**
     * Complex sine.
     */
    readonly sin: Complex;

    /**
     * Complex tangent.
     */
    readonly tan: Complex;

    /**
     * Returns zero complex.
     */
    static zero(): Complex;

    /**
     * Creates a complex number from polar coordinates.
     *
     * @param z Magnitude.
     * @param phi Angle in radians.
     */
    static fromPolar(
        z: number,
        phi: number
    ): Complex;

    /**
     * Creates FFT twiddle factor.
     */
    static twiddle(
        K: number,
        N: number
    ): Complex;

    /**
     * Generates random complex numbers.
     */
    static readonly random: {
        int(
            a?: number,
            b?: number
        ): Complex;

        float(
            a?: number,
            b?: number
        ): Complex;
    };
}


/**
 * Creates a complex number.
 */
export declare function complex(
    a?: number,
    b?: number
): Complex;

export declare function complex(
    a: Complex
): Complex;

export declare function complex(
    a: object
): Complex;


/**
 * Creates arrays of complex numbers from two arrays.
 */
export declare function complex(
    a: number[] | ArrayLike<number>,
    b: number[] | ArrayLike<number>
): Complex[];


/**
 * Creates a complex matrix by combining two matrices.
 */
export declare function complex(
    a: Matrix,
    b: Matrix
): Matrix;