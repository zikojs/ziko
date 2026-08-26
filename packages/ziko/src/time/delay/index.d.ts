export declare const sleep: (ms: number) => Promise<void>;

export interface TimeoutResult {
    id: ReturnType<typeof setTimeout>;
    clear: () => void;
    promise: Promise<void>;
}

export declare function timeout(
    ms: number,
    fn?: () => any
): TimeoutResult;
