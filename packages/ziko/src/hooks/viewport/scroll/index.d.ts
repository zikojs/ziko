import type { UIElement } from "../../../dom/UIElement";
export interface ScrollPosition {
    x: number;
    y: number;
}

export type ScrollValue = number | ((previous: number) => number);

export interface ScrollOptions {
    x?: ScrollValue;
    y?: ScrollValue;
    behavior?: ScrollBehavior;
}

export type ScrollCallback = (position: ScrollPosition) => void;

export type Dispose = () => void;

/**
 * Tracks and controls the scroll position of a window or HTML element.
 *
 * @param target The window or scrollable HTML element.
 * @param callback Called with the current scroll position.
 * @param THROTTLE_DELAY Minimum interval between callbacks, in milliseconds.
 * @returns A tuple containing the scroll setter and disposal function.
 *
 * @example
 * const [setScroll, dispose] = useScroll(
 *     document.querySelector('.container')!,
 *     ({ x, y }) => console.log(x, y)
 * );
 *
 * setScroll({ y: 100 });
 * setScroll({ y: old => old + 10 });
 *
 * dispose();
 */
export declare function useScroll(
    target: Window | UIElement | HTMLElement,
    callback: ScrollCallback,
    THROTTLE_DELAY?: number
): [
    setScroll: (options: ScrollOptions) => void,
    dispose: Dispose
];