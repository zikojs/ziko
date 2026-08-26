import type { Matrix } from "../matrix/index.js";
import type { Complex } from "../complex/index.js";

export type Mappable =
    | number
    | string
    | boolean
    | bigint
    | undefined
    | null
    | Complex
    | Matrix
    | object
    | any[]
    | Set<any>
    | Map<any, any>;

export type MapfunResult<F, T> =
    T extends Complex ? ReturnType<F> :
    // T extends Matrix ? Matrix :
    T extends Array<infer U> ? Array<MapfunResult<F, U>> :
    T extends Set<infer U> ? Set<MapfunResult<F, U>> :
    T extends Map<infer K, infer V> ? Map<K, MapfunResult<F, V>> :
    T extends object ? { [K in keyof T]: MapfunResult<F, T[K]> } :
    ReturnType<F>;

/**
 * Helper to unwrap single-element tuple
 */
type UnwrapSingle<T extends unknown[]> = T extends [infer U] ? U : { [K in keyof T]: T[K] };

/**
 * mapfun:
 * - if multiple values → return tuple
 * - if single value → return mapped value directly
 */
export declare function mapfun<
    F extends (x: any) => any,
    A extends Mappable[]
>(
    fun: F,
    ...values: A
): UnwrapSingle<{ [K in keyof A]: MapfunResult<F, A[K]> }>;
