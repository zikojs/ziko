// normalize_path.d.ts

/**
 * Normalizes a file path into a route path.
 *
 * @param inputPath - The file path to normalize (e.g., "./src/pages/user/[id].ts").
 * @param root - The root directory to consider as the base (default: "./src/pages").
 * @param extensions - Array of valid file extensions (default: ["js", "ts"]).
 * @returns A normalized route path (e.g., "/user/[id]") or an empty string if it cannot be normalized.
 */
export declare function normalize_path(
  inputPath: string,
  root?: string,
  extensions?: string[]
): string;
