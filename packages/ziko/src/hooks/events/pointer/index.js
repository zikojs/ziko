
export class PtrEvent extends Event {
    constructor(type, event, state) {
        super(type, {
            bubbles: event.bubbles,
            cancelable: event.cancelable,
            composed: event.composed
        });

        Object.assign(this, state);

        this.originalEvent = event;
        this.pointerId = event.pointerId;
        this.pointerType = event.pointerType;
        this.clientX = event.clientX;
        this.clientY = event.clientY;
        this.button = event.button;
        this.buttons = event.buttons;
        this.pressure = event.pressure;
    }
}

export function registerPtrEvents(element) {
    if (!element?.addEventListener) {
        throw new TypeError('Expected an EventTarget element');
    }

    const pointers = new Map();
    const listeners = new Map();

    const originalAdd = element.addEventListener.bind(element);
    const originalRemove = element.removeEventListener.bind(element);

    const PTR_EVENTS = new Set([
        'ptrdown', 'ptrmove', 'ptrup', 'ptrcancel'
    ]);

    const dispatch = (type, event, state) => {
        const callbacks = listeners.get(type);
        if (!callbacks) return;

        for (const { callback, normalized } of [...callbacks]) {
            const detail = getStateCoordinates(state, element, normalized);
            callback.call(element, new PtrEvent(type, event, detail));
        }
    };

    const onDown = event => {
        const { x, y } = getCoordinates(event, element);

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
                mx: undefined,
                my: undefined,
                ux: undefined,
                uy: undefined,
                isDown: false,
                isMoving: false,
                isDragging: false
            };

            pointers.set(event.pointerId, state);
        }

        const { x, y } = getCoordinates(event, element);

        state.mx = x;
        state.my = y;
        state.isMoving = true;
        state.isDragging = state.isDown;

        dispatch('ptrmove', event, state);
    };

    const onUp = event => {
        const state = pointers.get(event.pointerId);
        if (!state) return;

        const { x, y } = getCoordinates(event, element);

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
        if (!PTR_EVENTS.has(type)) {
            return originalAdd(type, callback, options);
        }

        if (typeof callback !== 'function') {
            return;
        }

        const list = listeners.get(type) ?? [];

        list.push({
            callback,
            normalized: options?.normalized ?? false
        });

        listeners.set(type, list);
    };

    element.removeEventListener = (type, callback, options) => {
        if (!PTR_EVENTS.has(type)) {
            return originalRemove(type, callback, options);
        }

        const list = listeners.get(type);
        if (!list) return;

        const filtered = list.filter(item => item.callback !== callback);

        if (filtered.length) {
            listeners.set(type, filtered);
        } else {
            listeners.delete(type);
        }
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

function getCoordinates(event, element) {
    const rect = element.getBoundingClientRect();

    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function getStateCoordinates(state, element, normalized) {
    const result = { ...state };

    if (!normalized) return result;

    const { clientWidth: w, clientHeight: h } = element;

    if (!w || !h) return result;

    for (const [x, y] of [
        ['dx', 'dy'],
        ['mx', 'my'],
        ['ux', 'uy']
    ]) {
        if (result[x] === undefined || result[y] === undefined) continue;

        result[x] = +((result[x] / w) * 2 - 1).toFixed(8);
        result[y] = +((result[y] / h) * -2 + 1).toFixed(8);
    }

    return result;
}
