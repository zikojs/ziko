export class PtrEvent extends PointerEvent {
    constructor(type, event, state) {
        super(type, event);
        Object.assign(this, state);
    }
}

const CUSTOM_EVENTS = new Set([
    'ptrdown', 'ptrmove', 'ptrup', 'ptrcancel',
    'tap', 'dbltap', 'longpress'
]);

export function registerPtrEvents(element, {
    longPressDelay = 500,
    tapMaxDuration = 300,
    tapThreshold = 10,
    doubleTapDelay = 300,
    doubleTapThreshold = 20
} = {}) {
    const pointers = new Map();
    const listeners = new Map();
    const timers = new Map();
    const downTimes = new Map();

    let lastTap = null;

    const originalAdd = element.addEventListener.bind(element);
    const originalRemove = element.removeEventListener.bind(element);

    const removeListener = (type, callback) => {
        const list = listeners.get(type);
        if (!list) return;

        const remaining = list.filter(item => item.callback !== callback);

        if (remaining.length) listeners.set(type, remaining);
        else listeners.delete(type);
    };

    const dispatch = (type, event, state) => {
        const callbacks = listeners.get(type);
        if (!callbacks) return;

        for (const item of [...callbacks]) {
            const { callback, normalized, once } = item;

            if (once) removeListener(type, callback);

            const detail = getStateCoordinates(state, element, normalized);
            const ptrEvent = new PtrEvent(type, event, detail);

            if (typeof callback === 'function') {
                callback.call(element, ptrEvent);
            } else {
                callback.handleEvent(ptrEvent);
            }
        }
    };

    const clearLongPress = id => {
        clearTimeout(timers.get(id));
        timers.delete(id);
    };

    const onDown = event => {
        const { x, y } = getCoordinates(event, element);

        const state = {
            dx: x, dy: y,
            mx: x, my: y,
            ux: undefined, uy: undefined,
            vx: 0, vy: 0,
            speed: 0,
            isDown: true,
            isMoving: false,
            isDragging: false,
            isLongPress: false,
            _time: event.timeStamp
        };

        pointers.set(event.pointerId, state);
        downTimes.set(event.pointerId, event.timeStamp);

        clearLongPress(event.pointerId);

        timers.set(event.pointerId, setTimeout(() => {
            const current = pointers.get(event.pointerId);
            if (!current || !current.isDown) return;

            const distance = Math.hypot(
                current.mx - current.dx,
                current.my - current.dy
            );

            if (distance > tapThreshold) return;

            current.isLongPress = true;

            dispatch('longpress', event, {
                ...current,
                duration: performance.now() - downTimes.get(event.pointerId)
            });
        }, longPressDelay));

        dispatch('ptrdown', event, state);
    };

    const onMove = event => {
        let state = pointers.get(event.pointerId);

        if (!state) {
            const { x, y } = getCoordinates(event, element);

            state = {
                dx: undefined, dy: undefined,
                mx: x, my: y,
                ux: undefined, uy: undefined,
                vx: 0, vy: 0,
                speed: 0,
                isDown: false,
                isMoving: false,
                isDragging: false,
                isLongPress: false,
                _time: event.timeStamp
            };

            pointers.set(event.pointerId, state);
        }

        const { x, y } = getCoordinates(event, element);
        const dt = event.timeStamp - state._time;

        if (dt > 0) {
            state.vx = (x - state.mx) / dt;
            state.vy = (y - state.my) / dt;
            state.speed = Math.hypot(state.vx, state.vy);
        }

        state.mx = x;
        state.my = y;
        state._time = event.timeStamp;
        state.isMoving = true;
        state.isDragging = state.isDown;

        if (state.isDown) {
            const distance = Math.hypot(x - state.dx, y - state.dy);
            if (distance > tapThreshold) clearLongPress(event.pointerId);
        }

        dispatch('ptrmove', event, state);
    };

    const onUp = event => {
        const state = pointers.get(event.pointerId);
        if (!state) return;

        clearLongPress(event.pointerId);

        const { x, y } = getCoordinates(event, element);
        const dt = event.timeStamp - state._time;

        if (dt > 0) {
            state.vx = (x - state.mx) / dt;
            state.vy = (y - state.my) / dt;
            state.speed = Math.hypot(state.vx, state.vy);
        }

        state.ux = x;
        state.uy = y;
        state.isDown = false;
        state.isMoving = false;
        state.isDragging = false;

        const duration = event.timeStamp - downTimes.get(event.pointerId);
        const distance = Math.hypot(x - state.dx, y - state.dy);

        dispatch('ptrup', event, state);

        if (
            !state.isLongPress &&
            duration <= tapMaxDuration &&
            distance <= tapThreshold
        ) {
            const tapState = { ...state, duration, isTap: true };

            dispatch('tap', event, tapState);

            const now = event.timeStamp;
            const isDoubleTap = lastTap &&
                now - lastTap.time <= doubleTapDelay &&
                Math.hypot(x - lastTap.x, y - lastTap.y) <= doubleTapThreshold &&
                lastTap.pointerType === event.pointerType;

            if (isDoubleTap) {
                dispatch('dbltap', event, {
                    ...tapState,
                    tapCount: 2
                });
                lastTap = null;
            } else {
                lastTap = {
                    time: now,
                    x,
                    y,
                    pointerType: event.pointerType
                };
            }
        } else {
            lastTap = null;
        }

        pointers.delete(event.pointerId);
        downTimes.delete(event.pointerId);
    };

    const onCancel = event => {
        const state = pointers.get(event.pointerId);
        if (!state) return;

        clearLongPress(event.pointerId);

        state.isDown = false;
        state.isMoving = false;
        state.isDragging = false;

        dispatch('ptrcancel', event, state);

        pointers.delete(event.pointerId);
        downTimes.delete(event.pointerId);
    };

    element.addEventListener = (type, callback, options = {}) => {
        if (!CUSTOM_EVENTS.has(type)) {
            return originalAdd(type, callback, options);
        }

        if (!callback || options.signal?.aborted) return;

        const list = listeners.get(type) ?? [];

        if (list.some(item => item.callback === callback)) return;

        list.push({
            callback,
            normalized: options.normalized ?? false,
            once: options.once ?? false
        });

        listeners.set(type, list);

        options.signal?.addEventListener(
            'abort',
            () => removeListener(type, callback),
            { once: true }
        );
    };

    element.removeEventListener = (type, callback, options) => {
        if (CUSTOM_EVENTS.has(type)) {
            removeListener(type, callback);
            return;
        }

        return originalRemove(type, callback, options);
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

        for (const id of timers.keys()) clearLongPress(id);

        element.addEventListener = originalAdd;
        element.removeEventListener = originalRemove;

        listeners.clear();
        pointers.clear();
        downTimes.clear();
        lastTap = null;
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
    delete result._time;

    if (!normalized) return result;

    const { clientWidth: w, clientHeight: h } = element;

    for (const [x, y] of [['dx', 'dy'], ['mx', 'my'], ['ux', 'uy']]) {
        if (result[x] === undefined || result[y] === undefined) continue;

        result[x] = w ? +((result[x] / w) * 2 - 1).toFixed(8) : 0;
        result[y] = h ? +((result[y] / h) * -2 + 1).toFixed(8) : 0;
    }

    result.vx = w ? +(result.vx / w * 2).toFixed(8) : 0;
    result.vy = h ? +(-result.vy / h * 2).toFixed(8) : 0;
    result.speed = Math.hypot(result.vx, result.vy);

    return result;
}