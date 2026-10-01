import { UIElement as UIElementCore } from "../../mini-dom/UIElement/index.js";
import { register_to_class } from "../../internal-utils/register/register-to-class.js";
import {
  // LifecycleMethods,
  AttrsMethods,
  // DomMethods,
  // IndexingMethods,
  // StyleMethods,
} from "../../mini-dom/mixins/index.js";

import {
  EventController,
  PtrListeners,
  ClickListeners,
  KeyListeners,
  ViewListeners,
} from "../../events/index.js";
import { isStateGetter } from "../../hooks/use-state.js";
import { text } from "../../mini-dom/text/index.js";
export class UIElement extends UIElementCore {
  constructor({
    element,
    name = "",
    type = "html",
    render = __Ziko__.__Config__.default.render,
    props,
  } = {}) {
    super();
    this.exp = {
      events: {},
    };
    register_to_class(
      this,
      // LifecycleMethods,
      AttrsMethods,
      // DomMethods,
      // StyleMethods,
      // IndexingMethods,
      PtrListeners,
      ClickListeners,
      KeyListeners,
      ViewListeners,
    );

    if (element) this.init({ element, name, type, render, props });
  }
  on(
    event_name,
    callback,
    {
      details_setter,
      category = "global",
      isCustom = false,
      preventDefault = false,
    } = {},
  ) {
    if (event_name instanceof Array)
      event_name.forEach((event) =>
        this.on(event, callback, {
          details_setter,
          category,
          isCustom,
          preventDefault,
        }),
      );
    if (category && !this.exp.events.hasOwnProperty(category))
      this.exp.events[category] = new EventController(this, category);
    isCustom && this.exp.events[category].cache.customEvents.add(event_name);
    const EVENT = this.exp.events[category];
    EVENT.addListener(
      event_name,
      (e) => {
        if (details_setter) details_setter(EVENT);
        callback(e);
      },
      {
        preventDefault,
      },
    );
    return this;
  }
  off(event, category = "global") {
    this.exp.events[category].removeListener(event);
    return this;
  }
  get element() {
    return this.cache.element;
  }
  get itemsTarget() {
    return this.cache.itemsTarget;
  }
  get itemsTargetElement() {
    return this.itemsTarget.element;
  }
  setItemsTarget(parent) {
    this.cache.itemsTarget = parent;
    this.items = parent.items;
    return this;
  }
  isInteractive() {
    return this.cache.isInteractive;
  }
  useClient(directive) {
    if (!this.cache.isInteractive) {
      this.element.setAttribute(
        "data-hydration-index",
        globalThis.__Ziko__.__HYDRATION__.index,
      );
      globalThis.__Ziko__.__HYDRATION__.register(() => this.constructor);
      this.cache.isInteractive = true;
    }
    if (directive)
      this.element.setAttribute("data-hydration-directive", directive);
    return this;
  }
  // get st(){
  //   return this.cache.style;
  // }
  get attr() {
    return this.cache.attributes;
  }
  get evt() {
    return this.events;
  }
  get html() {
    return this.element.innerHTML;
  }
  get text() {
    return this.element.textContent;
  }
  // get isBody(){
  //   return this.element === globalThis?.document.body;
  // }
  get parent() {
    return this.cache.parent;
  }
  get rect() {
    return this.element.getBoundingClientRect();
  }
  // get width(){
  //   return this.element.getBoundingClientRect().width;
  // }
  // get height(){
  //   return this.element.getBoundingClientRect().height;
  // }
  // get top(){
  //   return this.element.getBoundingClientRect().top;
  // }
  // get right(){
  //   return this.element.getBoundingClientRect().right;
  // }
  // get bottom(){
  //   return this.element.getBoundingClientRect().bottom;
  // }
  // get left(){
  //   return this.element.getBoundingClientRect().left;
  // }

  // Lifecycle

  mount(target = this.target, delay = 0) {
    if (this.isBody) return this;
    if (target?.isUIElement) target = target.element;
    this.target = target;
    this.target?.appendChild(this.element);
    return this;
  }
  unmount() {
    if (this.cache.parent) {
      this.cache.parent.remove(this);
    } else if (
      this.target?.children?.length &&
      [...this.target.children].includes(this.element)
    )
      this.target.removeChild(this.element);
    return this;
  }

  // Indexing

  at(index) {
    return this.items.at(index);
  }
  forEach(callback) {
    this.items.forEach(callback);
    return this;
  }
  map(callback) {
    return this.items.map(callback);
  }
  find(condition) {
    return this.items.filter(condition);
  }
  // Styling
  style(styles) {
    if (!this.element?.style) return this;
    for (let key in styles) {
      const value = styles[key];
      if (isStateGetter(value)) {
        const getter = value();
        Object.assign(this.element.style, { [key]: getter.value });
        getter._subscribe(
          (newValue) => {
            Object.assign(this.element.style, { [key]: newValue });
          },
          // this
        );
      } else Object.assign(this.element.style, { [key]: value });
    }
    return this;
  }
  size(width, height) {
    return this.style({ width, height });
  }
  hide() {}
  show() {}

  // Dom

  append(...ele) {
    this.__addItems__("append", "push", ...ele);
    return this;
  }
  prepend(...ele) {
    this.this.__addItems__("prepend", "unshift", ...ele);
    return this;
  }
  insertAt(index, ...ele) {
    const target = this.itemsTarget;
    if (index >= target.items.length) return this.append(...ele);
    for (let i = 0; i < ele.length; i++) {
      if (["number", "string"].includes(typeof ele[i])) ele[i] = text(ele[i]);
      target.element?.insertBefore(ele[i].element, target.items[index].element);
      target.items.splice(index, 0, ele[i]);
    }
    target.maintain();
    return this;
  }
  remove(...ele) {
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

  async __addItem__(adder, pusher, item, referenceNode = null, index = null) {
    const { element: itemsTargetEl, items } = this.itemsTarget;
    if (["number", "string"].includes(typeof item)) item = text(item);
    if (typeof item === "function" && isStateGetter(item)) {
      const getter = item();
      item = getter.value;

      getter._subscribe((newValue) => {
        if (newValue?.isUIElement?.()) {
          item.element.replaceWith(newValue.element);
          item = newValue;
        } else {
          item.element.textContent = newValue;
        }
      });
    }
    if (
      typeof globalThis?.Node === "function" &&
      item instanceof globalThis.Node
    )
      item = new UIElement({element : item});
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

  async __addItems__(adder, pusher, ...elements) {
    for (const item of elements) {
      await this.__addItem__(adder, pusher, item);
    }
    this.maintain();
    return this;
  }
}
