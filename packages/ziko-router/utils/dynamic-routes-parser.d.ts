// dynamic_routes_parser.d.ts

/**
 * Parses a route according to a dynamic mask and returns extracted parameters.
 *
 * @param mask - The dynamic route mask (e.g., "/user/[id]+", "/blog/[...slug]").
 * @param route - The actual route to parse (e.g., "/user/42", "/blog/2025/oct/post").
 * @returns An object mapping parameter names to their corresponding values.
 *          Returns an empty object if the route does not match the mask.
 */
export declare function dynamic_routes_parser(
  mask: string,
  route: string
): Record<string, string>;
