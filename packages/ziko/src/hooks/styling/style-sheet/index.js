import { UIElement } from '../../../dom/UIElement/index.js';
export const createStyleSheet = (initial = '', target = document.head) => {
    if (target instanceof UIElement) target = target.element;
    if (!target?.appendChild) throw new TypeError('A valid DOM target is required');
    const style = document.createElement('style');
    let stylesheet = initial;
    let disposed = false;
    const set = (css, append = false) => {
        if (disposed) throw new Error('Stylesheet has been disposed');
        if (typeof css === 'function') css = css(stylesheet);
        if (typeof css !== 'string') throw new TypeError('Stylesheet must be a string');
        stylesheet = append ? stylesheet + '\n' + css : css;
        style.textContent = stylesheet;
        if (!style.isConnected) target.appendChild(style);
    };
    const remove = () => style.remove();
    const dispose = () => {
        if (disposed) return;
        remove();
        disposed = true;
    };
    set(initial);
    return [set, remove, dispose];
};