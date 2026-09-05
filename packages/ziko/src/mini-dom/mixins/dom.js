import { text } from "../text/index.js";
import { isStateGetter } from "../../hooks/use-state.js";
export function append(...ele) {
  __addItems__.call(this, "append", "push", ...ele);
  return this;
}
export function prepend(...ele) {
  this.__addItems__.call(this, "prepend", "unshift", ...ele);
  return this;
}
export function insertAt(index, ...ele) {
    const target = this.itemsTarget;
    if (index >= target.items.length) return this.append(...ele);
    for (let i = 0; i < ele.length; i++) {
        if (["number", "string"].includes(typeof ele[i]))
            ele[i] = text(ele[i]);
        target.element?.insertBefore(
            ele[i].element,
            target.items[index].element
        );
        target.items.splice(index, 0, ele[i]);
    }
    target.maintain();
    return this;
}
export function remove(...ele) {
  const remove = (ele) => {
    if (typeof ele === "number") ele = this.items[ele];
    if (ele?.isUIElement) this.itemsTarget.element?.removeChild(ele.element);
    this.items = this.items.filter((n) => n !== ele);
  };
  for (let i = 0; i < ele.length; i++) remove(ele[i]);
  for (let i = 0; i < this.items.length; i++)
    Object.assign(this, { [[i]]: this.items[i] });
  // Remove from item
  return this;
}
export function clear(){
  this?.items?.forEach(n=>n.unmount());
  this.itemsTarget.element.innerHTML = '';
  return this;
}
export function replaceElementWith(new_element){
    this.cache.element.replaceWith(new_element)
    this.cache.element = new_element;
    // To do : Dispose Events and States 
    return this
}
export function after(ui){
  if(ui?.isUIElement) ui = ui.element;
  this.itemsTarget.element?.after(ui)
  return this;
}
export function before(ui){
  if(ui?.isUIElement) ui = ui.element;
  this.itemsTarget.element?.before(ui)
  return this;
}

export async function __addItem__(adder, pusher, item, referenceNode = null, index = null) {
  const { element: itemsTargetEl, items } = this.itemsTarget;
  if (["number", "string"].includes(typeof item)) item = text(item);
  if (typeof item === "function" && isStateGetter(item)) {
    const getter = item();
    item = text(getter.value);
    getter._subscribe(
      (newValue) => { item.element.textContent = newValue; },
      item
    );
  }
  if (typeof globalThis?.Node === "function" && item instanceof globalThis.Node)
    item = new this.constructor(item);
  if (item instanceof Promise) item = await item;
  if (item?.isUINode) {
    item.cache.parent = this;
    item.target = itemsTargetEl;
    if (adder === "insertBefore" && itemsTargetEl) 
      itemsTargetEl.insertBefore(item.element, referenceNode);
    else if (typeof itemsTargetEl?.[adder] === "function") 
      itemsTargetEl[adder](item.element);
    if (pusher === "splice" && index !== null) items.splice(index, 0, item);
    else if (typeof items?.[pusher] === "function") items[pusher](item);
    return;
  }
}

export async function __addItems__(adder, pusher, ...elements) {
  for (const item of elements) {
    await this.__addItem__(adder, pusher, item);
  }
  this.maintain();
  return this;
}