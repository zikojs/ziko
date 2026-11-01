import { UIElement } from "../../../dom/UIElement/index.js";
export const useLongPress = (target, callback, timeout = 500) => {
    if(target instanceof UIElement) target = target.element
    let timer;
    let isPressed = false;

    const start = (event) => {
        if (isPressed) return;

        isPressed = true;

        timer = setTimeout(() => {
            callback(event);
        }, timeout);
    };

    const cancel = () => {
        clearTimeout(timer);
        isPressed = false;
    };

    target.addEventListener('pointerdown', start);
    target.addEventListener('pointerup', cancel);
    target.addEventListener('pointerleave', cancel);
    target.addEventListener('pointercancel', cancel);

    return cancel;
};