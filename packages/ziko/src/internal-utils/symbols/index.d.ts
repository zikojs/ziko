/**
 * Runtime brand identifying a ZikoJS `mapfun` function.
 *
 * Used for runtime type detection without importing the `mapfun`
 * implementation, helping prevent circular dependencies.
 */
export declare const MAPFUN: unique symbol;

/**
 * Runtime brand identifying a ZikoJS `Complex` instance.
 *
 * Used for nominal runtime type detection without importing the
 * `Complex` class directly.
 */
export declare const COMPLEX: unique symbol;

/**
 * Runtime brand identifying a ZikoJS `Matrix` instance.
 *
 * Used for nominal runtime type detection without importing the
 * `Matrix` class directly.
 */
export declare const MATRIX: unique symbol;

/**
 * Runtime brand identifying a ZikoJS `UIElement` instance.
 *
 * Used to detect UI elements without creating a dependency on the
 * `UIElement` implementation.
 */
export declare const UIELEMENT: unique symbol;

/**
 * Runtime brand identifying a ZikoJS state getter.
 *
 * Used by hooks and UI components to recognize state getters without
 * importing the state implementation.
 */
export declare const STATE_GETTER: unique symbol;

export declare const LAYOUT: unique symbol;
export declare const PAGE: unique symbol;