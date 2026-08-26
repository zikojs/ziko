import { throttle } from "../../time/decorators/index.js";
class ViewEvent extends CustomEvent {
    constructor(type, detail, { bubbles = true, cancelable = true } = {}) {
        super(type, { detail, bubbles, cancelable });
    }
}

function register_view_event(
    element,
    {
        intersection = true,
        resize = true,
        threshold = 0,
        throttleResize = 100,
        throttleEnterExit = 0
    } = {}
) {
    let intersectionObserver, resizeObserver;
    const resizeCallback = entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;

            element.dispatchEvent(
                new ViewEvent("resizeview", {
                    width,
                    height,
                    entry
                })
            );
        }
    };

    const throttledResize = throttleResize > 0
        ? throttle(resizeCallback, throttleResize)
        : resizeCallback;

    const intersectionCallback = entries => {
        for (let entry of entries) {
            const type = entry.isIntersecting ? "enterview" : "exitview";
            element.dispatchEvent(new ViewEvent(type, entry));
        }
    };

    const throttledIntersections = throttleEnterExit > 0
        ? throttle(intersectionCallback, throttleEnterExit)
        : intersectionCallback;

    if (intersection) {
        intersectionObserver = new IntersectionObserver(throttledIntersections, { threshold });
        intersectionObserver.observe(element);
    }

    if (resize) {
        resizeObserver = new ResizeObserver(throttledResize);
        resizeObserver.observe(element);
    }

    // ---- UNREGISTER ----
    return () => {
        if (intersectionObserver) {
            intersectionObserver.unobserve(element);
            intersectionObserver.disconnect();
        }
        if (resizeObserver) {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
        }
    };
}

export {
    ViewEvent,
    register_view_event
};
