import type {
    ScrollCallback,
    ScrollOptions,
    Dispose
} from '../scroll/index.d.ts';

/**
 * Tracks and controls the window's scroll position.
 *
 * @param callback Called with the current scroll position.
 * @param THROTTLE_DELAY Minimum interval between callbacks, in milliseconds.
 * @returns A tuple containing the scroll setter and disposal function.
 *
 * @example
 * const [setScroll, dispose] = useWindowScroll(
 *     ({ x, y }) => console.log(x, y)
 * );
 *
 * setScroll({ y: 100 });
 * setScroll({ y: old => old + 10 });
 *
 * dispose();
 */
export declare function useWindowScroll(
    callback: ScrollCallback,
    THROTTLE_DELAY?: number
): [
    setScroll: (options: ScrollOptions) => void,
    dispose: Dispose
];