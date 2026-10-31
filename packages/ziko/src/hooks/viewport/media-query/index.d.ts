export interface MediaQueryRule {
    query: string;
    callback: () => void;
}

export type MediaQueryFallback = () => void;

export type MediaQueryChangeListener = (
    current: MediaQueryRule | null,
    previous: MediaQueryRule | null
) => void;

export declare class MediaQuery {
    constructor(
        rules?: MediaQueryRule[],
        fallback?: MediaQueryFallback
    );

    readonly current: string | null;
    readonly matches: boolean;

    onChange(
        callback: MediaQueryChangeListener
    ): () => void;

    update(): this;

    destroy(): void;
}

export declare function useMediaQuery(
    rules?: MediaQueryRule[],
    fallback?: MediaQueryFallback
): MediaQuery;