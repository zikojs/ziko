// get_root.d.ts

/**
 * Finds the common root path among an array of paths.
 * Dynamic segments (e.g., `[id]`) are considered as matching any segment.
 *
 * @param paths - An array of route paths (e.g., ["/user/42", "/user/99"]).
 * @returns The common root path as a string (e.g., "/user/").
 *          Returns an empty string if no common root exists.
 */
export declare function get_root(paths: string[]): string;
