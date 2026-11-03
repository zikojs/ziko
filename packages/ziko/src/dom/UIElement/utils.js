import { text } from '../text/index.js'
import { isStateGetter } from '../../hooks/state/use-state/index.js';
export const normalize = (UIElement, value) => {
  if (value?.isUINode) return value;
  if (typeof globalThis.Node === 'function' && value instanceof globalThis.Node) {
    return new UIElement({ element: value });
  }
  return text(value ?? '');
};


export const __addItem__ = (UIElement, ctx, adder, pusher, item, referenceNode = null, index = null) => {
    const { element: itemsTargetEl, items } = ctx.itemsTarget;
    if (['number', 'string'].includes(typeof item)) item = text(item);
    if (typeof item === 'function' && isStateGetter(item)) {
        const getter = item();
        let currentItem = normalize(UIElement, getter.value);
        item = currentItem;
        getter._subscribe((value) => {
            const nextItem = normalize(UIElement, value);
            if (nextItem === currentItem) return;
            const currentIndex = items.indexOf(currentItem);
            if (currentIndex !== -1) {
                currentItem.element.replaceWith(nextItem.element);
                items[currentIndex] = nextItem;
            } 
            else if (currentItem.element.parentNode) currentItem.element.replaceWith(nextItem.element);
            else return;
            nextItem.cache.parent = ctx;
            nextItem.target = itemsTargetEl;
            currentItem = nextItem;
        });
    }
    if (typeof globalThis?.Node === 'function' && item instanceof globalThis.Node) item = new UIElement({ element: item });
    if (item instanceof Promise) {
        return item.then(resolved => __addItem__(UIElement, ctx, adder, pusher, resolved, referenceNode, index));
    }
    if (item?.isUINode) {
        item.cache.parent = ctx;
        item.target = itemsTargetEl;
        if(adder === 'insertBefore' && itemsTargetEl) 
          itemsTargetEl.insertBefore(item.element, referenceNode);
        else if (typeof itemsTargetEl?.[adder] === 'function') 
          itemsTargetEl[adder](item.element);
        if (pusher === 'splice' && index !== null) 
          items.splice(index, 0, item);
        else if (typeof items?.[pusher] === 'function') 
          items[pusher](item);
    }
}

export const __addItems__=(UIElement, ctx, adder, pusher, ...elements)=>{
    let pending = null;
    for (const item of elements) {
        if (pending) {
            pending = pending.then(() =>__addItem__(UIElement, ctx, adder, pusher, item));
            continue;
        }
        const result = __addItem__(UIElement, ctx, adder, pusher, item);
        if (result instanceof Promise) pending = result;
    }
    if (pending) {
        return pending.then(() => {
            maintain(ctx);
            return ctx;
        });
    }
    maintain(ctx);
    return ctx;
}

export const maintain = (ctx) => {
    for (let i = 0; i < ctx.items.length; i++) {
      Object.defineProperty(ctx, i, {
        value: ctx.items[i],
        writable: true,
        configurable: true,
        enumerable: false 
        });
    }
  }