/**
 * Converts a value from one numerical base to another.
 *
 * Supported bases are between 2 and 36.
 *
 * @param value Value to convert.
 * @param fromBase Source base.
 * @param toBase Target base.
 *
 * @example
 * base2base("1010", 2, 10) // "10"
 */
export declare function base2base(
    value: string | number,
    fromBase: number,
    toBase: number
): string;

/**
 * Converts binary values to octal.
 */
export declare function bin2oct(
    ...x: (string | number)[]
): string[];

/**
 * Converts binary values to decimal.
 */
export declare function bin2dec(
    ...x: (string | number)[]
): string[];

/**
 * Converts binary values to hexadecimal.
 */
export declare function bin2hex(
    ...x: (string | number)[]
): string[];

/**
 * Converts octal values to binary.
 */
export declare function oct2bin(
    ...x: (string | number)[]
): string[];

/**
 * Converts octal values to decimal.
 */
export declare function oct2dec(
    ...x: (string | number)[]
): string[];

/**
 * Converts octal values to hexadecimal.
 */
export declare function oct2hex(
    ...x: (string | number)[]
): string[];

/**
 * Converts decimal values to binary.
 */
export declare function dec2bin(
    ...x: (string | number)[]
): string[];

/**
 * Converts decimal values to octal.
 */
export declare function dec2oct(
    ...x: (string | number)[]
): string[];

/**
 * Converts decimal values to hexadecimal.
 */
export declare function dec2hex(
    ...x: (string | number)[]
): string[];

/**
 * Converts hexadecimal values to binary.
 */
export declare function hex2bin(
    ...x: (string | number)[]
): string[];

/**
 * Converts hexadecimal values to octal.
 */
export declare function hex2oct(
    ...x: (string | number)[]
): string[];

/**
 * Converts hexadecimal values to decimal.
 */
export declare function hex2dec(
    ...x: (string | number)[]
): string[];