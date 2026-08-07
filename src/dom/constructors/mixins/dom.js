import { text } from "../../text/index.js";
import { isStateGetter } from "../../../hooks/use-state.js";

export function append(...ele) {
  __addItem__.call(this, "append", "push", ...ele);
  return this;
}
export function prepend(...ele) {
  this.__addItem__.call(this, "prepend", "unshift", ...ele);
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
  if(ui?.isUIElement) ui=ui.element;
  this.itemsTarget.element?.after(ui)
  return this;
}
export function before(ui){
  if(ui?.isUIElement) ui=ui.element;
  this.itemsTarget.element?.before(ui)
  return this;
}




export async function __addItem__(adder, pusher, ...ele) {
  const itemsTarget_el = this.itemsTarget.element;
  const itemsTarget = this.itemsTarget

  if (this.cache.isFrozzen) {
    console.warn("You can't append new item to frozzen element");
    return this;
  }
  for (let i = 0; i < ele.length; i++) {
    if (["number", "string"].includes(typeof ele[i])) ele[i] = text(ele[i]);
        // Fix Items Latter
    if (ele[i] instanceof Function) {
      if (isStateGetter(ele[i])) {
        const getter = ele[i]();
        ele[i] = text(getter.value);
        getter._subscribe(
            (newValue) => (ele[i].element.textContent = newValue),
            ele[i] 
        );
        // this.itemsTarget.element.appendChild(textNode);
      }
    }
    if (typeof globalThis?.Node === "function" && ele[i] instanceof globalThis?.Node) ele[i] = new this.constructor(ele[i]);
    if (ele[i]?.isUINode) {
        ele[i].cache.parent = this;
        itemsTarget_el?.[adder](ele[i].element);
        ele[i].target = this.itemsTarget.element;
        itemsTarget.items[pusher](ele[i]);
    } 
    else if(ele[i] instanceof Promise){
      const UIEle = await ele[i]
      UIEle.cache.parent = this;
      itemsTarget_el?.[adder](UIEle.element);
      UIEle.target = this.itemsTarget.element;
      itemsTarget.items[pusher](UIEle)
    }
    else if (ele[i] instanceof Object) {
      if (ele[i]?.style) this.style(ele[i]?.style);
      if (ele[i]?.attr) {
        Object.entries(ele[i].attr).forEach((n) =>
          this.setAttr("" + n[0], n[1]),
        );
      }
    }
  }
  this.maintain();
  return this;
}