export class LongPressEvent extends PointerEvent {
    constructor(event, state) {
        super('longpress', event);
        Object.assign(this, state);
    }
}

export function registerLongPressEvent(element, delay = 500) {
    const pointers = new Map();

    const onDown = event => {
        const pointer = { startedAt: performance.now() };

        pointer.timer = setTimeout(() => {
            if (!pointers.has(event.pointerId)) return;

            element.dispatchEvent(new LongPressEvent(event, {
                duration: performance.now() - pointer.startedAt
            }));
        }, delay);

        pointers.set(event.pointerId, pointer);
    };

    const onEnd = event => {
        const pointer = pointers.get(event.pointerId);
        if (!pointer) return;

        clearTimeout(pointer.timer);
        pointers.delete(event.pointerId);
    };

    element.addEventListener('pointerdown', onDown);
    element.addEventListener('pointerup', onEnd);
    element.addEventListener('pointercancel', onEnd);

    return () => {
        element.removeEventListener('pointerdown', onDown);
        element.removeEventListener('pointerup', onEnd);
        element.removeEventListener('pointercancel', onEnd);

        for (const pointer of pointers.values()) {
            clearTimeout(pointer.timer);
        }

        pointers.clear();
    };
}