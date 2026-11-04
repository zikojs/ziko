export class ViewEvent extends CustomEvent {
    constructor(type, detail, { bubbles = true, cancelable = true } = {}) {
        super(type, { detail, bubbles, cancelable });
    }
}

export function registerViewEvents(element, { threshold = 0} = {}){
    const intersectionCallback = entries => {
        for (let entry of entries) {
            const type = entry.isIntersecting ? "enterview" : "exitview";
            element.dispatchEvent(new ViewEvent(type, entry));
        }
    };

    let intersectionObserver = new IntersectionObserver(intersectionCallback, { threshold });
    intersectionObserver.observe(element);
    // ---- UNREGISTER ----
    return () => {
        intersectionObserver.unobserve(element);
        intersectionObserver.disconnect();
    };
}
