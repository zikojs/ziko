import { useScroll } from '../scroll/index.js';

export const useWindowScroll = (callback, THROTTLE_DELAY = 100) =>
    useScroll(window, callback, THROTTLE_DELAY);