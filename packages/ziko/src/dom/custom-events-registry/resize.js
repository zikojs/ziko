export class ResizeEvent extends CustomEvent {
    constructor(type, detail, { bubbles = true, cancelable = true } = {}) {
        super(type, { detail, bubbles, cancelable });
    }
}

export function registerResizeEvent(element) {
    let resizeObserver;
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
    resizeObserver = new ResizeObserver(resizeCallback);
    resizeObserver.observe(element);
    // ---- UNREGISTER ----
    return () => {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
    };
}
