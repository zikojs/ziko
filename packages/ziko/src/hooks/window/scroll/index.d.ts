export type ScrollValue = number | ((previous: number) => number);

export interface ScrollOptions {
    x?: ScrollValue;
    y?: ScrollValue;
    behavior?: ScrollBehavior;
}

export interface ScrollPosition {
    x: number;
    y: number;
}

export type ScrollCallback = (position: ScrollPosition) => void;

export declare function useWindowScroll(
    callback?: ScrollCallback,
    THROTTLE_DELAY?: number
): [
    setScroll: (options: ScrollOptions) => void,
    dispose: () => void
];