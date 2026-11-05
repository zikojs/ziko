export class ResizeEvent extends CustomEvent {
    constructor(type, detail, { bubbles = true, cancelable = true } = {}) {
        super(type, { detail, bubbles, cancelable });
    }
}

export function registerResizeEvent(element) {
    if (typeof globalThis.ResizeObserver !== 'function') return () => {};
    const resizeCallback = entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;
            element.dispatchEvent(
                new ResizeEvent('resize', {
                    width,
                    height,
                    entry
                })
            );
        }
    };
    let resizeObserver = new ResizeObserver(resizeCallback);
    resizeObserver.observe(element);
    // ---- UNREGISTER ----
    return () => {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
    };
}
