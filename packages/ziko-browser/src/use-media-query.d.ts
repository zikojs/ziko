export interface MediaQueryRule {
    query: string;
    callback: () => void;
}

export class UseMediaQuery {
    // Private fields (only for type awareness; not accessible)
    private readonly #mediaQueryRules: MediaQueryRule[];
    private readonly #fallback: () => void;
    private #lastCalledCallback: (() => void) | null;

    constructor(
        mediaQueryRules?: MediaQueryRule[],
        fallback?: () => void
    );
}

/**
 * Helper function to create a UseMediaQuery instance.
 */
export function useMediaQuery(
    mediaQueryRules?: MediaQueryRule[],
    fallback?: () => void
): UseMediaQuery;
