// mapfun.d.ts

type Fn = (...args: any[]) => any;

type Primitive = string | number | bigint | boolean | symbol | null | undefined;

type TypedArray =
  | Int8Array | Uint8Array | Uint8ClampedArray
  | Int16Array | Uint16Array
  | Int32Array | Uint32Array
  | Float32Array | Float64Array
  | BigInt64Array | BigUint64Array;

/** Objects flagged with `__mapfun__` are treated as leaves: `fun` is applied directly. */
interface MapfunLeaf {
  readonly __mapfun__: true;
}

/** Anything with `isMatrix()`: rebuilt via its constructor, so the type is preserved. */
interface MatrixLike {
  isMatrix(): boolean;
  rows: number;
  cols: number;
  arr: any[][];
}

/**
 * Collects up to 4 overload signatures of F as [Args, Return] pairs, in declaration order.
 * If F has fewer overloads, entries are duplicated, which is harmless for the lookup below.
 */
type Sigs<F> = F extends {
  (...a: infer A1): infer R1;
  (...a: infer A2): infer R2;
  (...a: infer A3): infer R3;
  (...a: infer A4): infer R4;
}
  ? [[A1, R1], [A2, R2], [A3, R3], [A4, R4]]
  : never;

/** First overload whose first parameter accepts L. Distributes over unions. */
type FirstMatch<S extends readonly unknown[], L, F> =
  S extends readonly [infer H, ...infer T]
    ? H extends [infer P extends any[], infer R]
      ? [L] extends [P[0]]
        ? R
        : FirstMatch<T, L, F>
      : FirstMatch<T, L, F>
    : F extends Fn ? ReturnType<F> : never; // fallback: last overload's return

/** Return type of F when called with a leaf of type L (overload-aware). */
type CallOn<F, L> = L extends unknown ? FirstMatch<Sigs<F>, L, F> : never;

/** Structural mapping of X through F, mirroring the runtime branches of mapfun. */
export type Mapped<F, X> =
  X extends MapfunLeaf ? CallOn<F, X>
  : X extends Primitive ? CallOn<F, X>
  : X extends TypedArray ? X
  : X extends Set<infer E> ? Set<Mapped<F, E>>
  : X extends Map<infer K, infer V> ? Map<K, Mapped<F, V>>
  : X extends MatrixLike ? X
  : X extends readonly unknown[] ? { -readonly [I in keyof X]: Mapped<F, X[I]> }
  : X extends object ? { [K in keyof X]: Mapped<F, X[K]> }
  : never;

/** One argument → the mapped value itself; several → a tuple of mapped values. */
export type MapfunResult<F, X extends readonly unknown[]> =
  number extends X["length"]
    ? Mapped<F, X[number]> | Mapped<F, X[number]>[]   // spread of a non-tuple array
    : X extends readonly [infer Only]
      ? Mapped<F, Only>
      : { [I in keyof X]: Mapped<F, X[I]> };

export function mapfun<F extends Fn, const X extends readonly unknown[]>(
  fun: F,
  ...X: X
): MapfunResult<F, X>;

const double = <X extends unknown[]>(...x: X) =>
  mapfun((n: number) => n * 2, ...x);