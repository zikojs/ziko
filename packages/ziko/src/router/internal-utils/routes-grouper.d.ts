// routes_utils.d.ts

/**
 * Checks if a route path is dynamic.
 * Dynamic segments include:
 *   - Parameters like "[id]"
 *   - Catch-all segments like "[...slug]"
 *   - Optional segments like "[id]+"
 *
 * @param path - The route path to check.
 * @returns `true` if the path is dynamic, otherwise `false`.
 */
export function is_dynamic(path: string): boolean;

/**
 * Groups routes into static and dynamic categories.
 * Throws an error if an optional parameter appears anywhere but the end of the path.
 *
 * @param routeMap - An object mapping route paths to their handlers/values.
 * @returns An object with two properties:
 *   - `static`: Routes with no dynamic segments.
 *   - `dynamic`: Routes with dynamic segments.
 */
export function routes_grouper<T>(
  routeMap: Record<string, T>
): {
  static: Record<string, T>;
  dynamic: Record<string, T>;
};
