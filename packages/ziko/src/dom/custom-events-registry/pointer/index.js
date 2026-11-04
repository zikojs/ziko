export class PtrEvent extends PointerEvent {
    constructor(type, event, state) {
        super(type, event);
        Object.assign(this, state);
    }
}

export function registerPtrEvents(element) {
    const pointers = new Map();
    const listeners = new Map();
    const originalAdd = element.addEventListener.bind(element);
    const originalRemove = element.removeEventListener.bind(element);
    const dispatch = (type, event, state) => {
        const callbacks = listeners.get(type);
        if (!callbacks) return;
        for (const { callback, normalized } of callbacks) {
            const detail = getStateCoordinates(state, element, normalized);
            callback.call(element, new PtrEvent(type, event, detail));
        }
    };

    const onDown = event => {
        const { x, y } = getCoordinates(event, element, false);
        const state = {
            dx: x,
            dy: y,
            mx: x,
            my: y,
            ux: undefined,
            uy: undefined,
            isDown: true,
            isMoving: false,
            isDragging: false
        };
        pointers.set(event.pointerId, state);
        dispatch('ptrdown', event, state);
    };

    const onMove = event => {
        let state = pointers.get(event.pointerId);
        if (!state) {
            state = {
                dx: undefined,
                dy: undefined,
                ux: undefined,
                uy: undefined,
                isDown: false,
                isDragging: false
            };
            pointers.set(event.pointerId, state);
        }

        const { x, y } = getCoordinates(event, element, false);
        state.mx = x;
        state.my = y;
        state.isMoving = true;
        state.isDragging = state.isDown;
        dispatch('ptrmove', event, state);
    };

    const onUp = event => {
        const state = pointers.get(event.pointerId);
        if (!state) return;
        const { x, y } = getCoordinates(event, element, false);
        state.ux = x;
        state.uy = y;
        state.isDown = false;
        state.isMoving = false;
        state.isDragging = false;
        dispatch('ptrup', event, state);
        pointers.delete(event.pointerId);
    };

    const onCancel = event => {
        const state = pointers.get(event.pointerId);
        if (!state) return;
        state.isDown = false;
        state.isMoving = false;
        state.isDragging = false;
        dispatch('ptrcancel', event, state);
        pointers.delete(event.pointerId);
    };

    element.addEventListener = (type, callback, options = {}) => {
        if (!type.startsWith('ptr')) {
            return originalAdd(type, callback, options);
        }
        const list = listeners.get(type) ?? [];
        list.push({
            callback,
            normalized: options.normalized ?? false
        });
        listeners.set(type, list);
    };
    element.removeEventListener = (type, callback, options) => {
        const PTR_EVENTS = new Set([
            'ptrdown', 'ptrmove', 'ptrup', 'ptrcancel'
        ]);
        if (PTR_EVENTS.has(type)) {
            return originalRemove(type, callback, options);
        }
        const list = listeners.get(type);
        if (!list) return;
        listeners.set(type, list.filter(item => item.callback !== callback));
    };
    originalAdd('pointerdown', onDown);
    originalAdd('pointermove', onMove);
    originalAdd('pointerup', onUp);
    originalAdd('pointercancel', onCancel);
    return () => {
        originalRemove('pointerdown', onDown);
        originalRemove('pointermove', onMove);
        originalRemove('pointerup', onUp);
        originalRemove('pointercancel', onCancel);
        element.addEventListener = originalAdd;
        element.removeEventListener = originalRemove;
        listeners.clear();
        pointers.clear();
    };
}

function getCoordinates(event, element, normalized = false) {
    const rect = element.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    if (normalized) {
        x = +((x / element.clientWidth) * 2 - 1).toFixed(8);
        y = +((y / element.clientHeight) * -2 + 1).toFixed(8);
    }
    return { x, y };
}

function getStateCoordinates(state, element, normalized) {
    const result = { ...state };
    if (!normalized) return result;

    const { clientWidth: w, clientHeight: h } = element;
    for (const [x, y] of [['dx', 'dy'], ['mx', 'my'], ['ux', 'uy']]) {
        if (result[x] === undefined || result[y] === undefined) continue;
        result[x] = +((result[x] / w) * 2 - 1).toFixed(8);
        result[y] = +((result[y] / h) * -2 + 1).toFixed(8);
    }
    return result;
}