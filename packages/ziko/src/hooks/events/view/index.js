export class ViewEvent extends CustomEvent {
    constructor(type, detail, { bubbles = true, cancelable = true } = {}) {
        super(type, { detail, bubbles, cancelable });
    }
}
export function registerViewEvents(element, { threshold = 0 } = {}) {
    const observers = new Map();
    const originalAdd = element.addEventListener.bind(element);
    element.addEventListener = (type, callback, options = {}) => {
        if (type !== 'enterview' && type !== 'exitview') {
            return originalAdd(type, callback, options);
        }
        const currentThreshold = options.threshold ?? threshold;
        if (!observers.has(currentThreshold)) {
            const callbacks = new Map();
            const observer = new IntersectionObserver(entries => {
                for (const entry of entries) {
                    const eventType = entry.isIntersecting ? 'enterview' : 'exitview';
                    for (const [registeredType, listeners] of callbacks) {
                        if (registeredType !== eventType) continue;
                        for (const listener of listeners) {
                            listener.call(element, new ViewEvent(eventType, entry));
                        }
                    }
                }
            }, { threshold: currentThreshold });
            observer.observe(element);
            observers.set(currentThreshold, { observer, callbacks });
        }
        const { callbacks } = observers.get(currentThreshold);
        if (!callbacks.has(type)) callbacks.set(type, new Set());
        callbacks.get(type).add(callback);
    };
    return () => {
        for (const { observer } of observers.values()) {
            observer.disconnect();
        }
        observers.clear();
        element.addEventListener = originalAdd;
    };
}