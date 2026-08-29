/**
 * Arithmetic operation compatible with numbers,
 * complex numbers, and matrix-like objects.
 */
export type ArithmeticValue = number | ComplexLike | MatrixLike;

/**
 * Minimal interface for complex number objects.
 */
export interface ComplexLike {
    isComplex(): boolean;

    clone(): this;

    add(value: number | ComplexLike): this;
    sub(value: number | ComplexLike): this;
    mul(value: number | ComplexLike): this;
    div(value: number | ComplexLike): this;
    modulo(value: number | ComplexLike): this;
}

/**
 * Minimal interface for matrix objects.
 */
export interface MatrixLike {
    rows: number;
    cols: number;

    isMatrix(): boolean;

    clone(): this;

    add(value: ArithmeticValue): this;
    sub(value: ArithmeticValue): this;
    mul(value: ArithmeticValue): this;
    div(value: ArithmeticValue): this;
    modulo(value: ArithmeticValue): this;
}

/**
 * Adds values together.
 *
 * Supports numbers, complex numbers, and matrices.
 *
 * @example
 * add(1, 2, 3) // 6
 */
export declare function add<T extends ArithmeticValue>(
    a: T,
    ...b: ArithmeticValue[]
): T;

/**
 * Subtracts values sequentially.
 *
 * @example
 * sub(10, 2, 3) // 5
 */
export declare function sub<T extends ArithmeticValue>(
    a: T,
    ...b: ArithmeticValue[]
): T;

/**
 * Multiplies values sequentially.
 *
 * @example
 * mul(2, 3, 4) // 24
 */
export declare function mul<T extends ArithmeticValue>(
    a: T,
    ...b: ArithmeticValue[]
): T;

/**
 * Divides values sequentially.
 *
 * @example
 * div(20, 2, 5) // 2
 */
export declare function div<T extends ArithmeticValue>(
    a: T,
    ...b: ArithmeticValue[]
): T;

/**
 * Calculates modulo sequentially.
 *
 * @example
 * modulo(20, 6) // 2
 */
export declare function modulo<T extends ArithmeticValue>(
    a: T,
    ...b: ArithmeticValue[]
): T;