export interface WindowSize {
    width: number;
    height: number;
}

export type WindowSizeTarget = 'inner' | 'outer';

export type WindowSizeCallback = (size: WindowSize) => void;

export declare function useWindowSize(
    callback: WindowSizeCallback,
    target?: WindowSizeTarget,
    THROTTLE_DELAY?: number
): () => void;