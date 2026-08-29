type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array;

/**
 * Custom mapped type that recursively applies leaf transformation `R`
 * while strictly maintaining structure (tuples, arrays, sets, maps, objects).
 */
export type MapFunResult<T, R> =
  // 1. Primitive types or explicit mapfun override tag
  T extends number | string | boolean | bigint | symbol | null | undefined | { __mapfun__?: any }
    ? R
    : // 2. Preserve Tuple length and element order precisely
    T extends [infer Head, ...infer Tail]
    ? [MapFunResult<Head, R>, ...MapFunResult<Tail, R>]
    : // 3. Standard homogeneous Arrays
    T extends Array<infer U>
    ? Array<MapFunResult<U, R>>
    : // 4. TypedArray views
    T extends TypedArray
    ? T
    : // 5. Sets
    T extends Set<infer U>
    ? Set<MapFunResult<U, R>>
    : // 6. Maps
    T extends Map<infer K, infer V>
    ? Map<K, MapFunResult<V, R>>
    : // 7. Matrix objects
    T extends { isMatrix: () => boolean }
    ? T
    : // 8. Plain Objects (preserve property keys)
    T extends object
    ? { [K in keyof T]: MapFunResult<T[K], R> }
    : R;

export function mapfun<T, R>(
  fun: (value: any) => R,
  x: T
): MapFunResult<T, R>;

export function mapfun<T extends any[], R>(
  fun: (value: any) => R,
  ...X: T
): { [K in keyof T]: MapFunResult<T[K], R> };