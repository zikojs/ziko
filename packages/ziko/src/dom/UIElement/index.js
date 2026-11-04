import { register_to_class } from "../../internal-utils/register/register-to-class.js";
import * as AttrsMethods from "../mixins/attrs.js";
import { isStateGetter } from "../../hooks/state/use-state/index.js";
import { text } from "../text/index.js";
import { UINode } from "../UINode/index.js";
import { __init__global__ } from "../../__ziko__/index.js";
import { UIStore } from "../../__ziko__/__ui__.js";
import { parse_props } from "../internal-utils/parse_props.js";
import { __addItems__, maintain } from "./utils.js";
import { throttle } from '../../time/throttle/index.js'


__init__global__();

import {
  registerClickAwayEvent,
  registerResizeEvent,
  registerViewEvents,
  registerPtrEvents,
  registerAttrUpdateEvent
} from '../custom-events-registry/index.js'

export class UIElement extends UINode {
  constructor({
    element,
    name = "",
    type = "html",
    autoMount = __Ziko__.__Config__.default.autoMount,
    props,
  } = {}) {
    super();
    register_to_class(this, AttrsMethods);
    if (element) this.init({ element, name, type, autoMount, props });
    registerClickAwayEvent(this.element);
    registerResizeEvent(this.element);
    registerViewEvents(this.element);
    registerPtrEvents(this.element);
    registerAttrUpdateEvent(this.element)
  }
  init({ element, name, type, autoMount, props = {}, items = [] } = {}) {
    this.target =
      globalThis.__Ziko__.__Config__.default.target ||
      globalThis?.document?.body;
    if (typeof element === "string" && globalThis?.document) {
      switch (type) {
        case "html":
          element = document.createElement(element); break;
        case "svg":
          element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            element,
          ); break;
        default:
          throw Error("Not supported");
      }
    } 
    else this.target = element?.parentElement;
    Object.assign(this.cache, {
      name,
      itemsTarget: this,
      isInteractive: false,
      parent: null,
      events : {}
    });
    this.cache.eventsController = new AbortController();
    if (element) Object.assign(this.cache, { element });
    this.items = new UIStore();
    globalThis.__Ziko__.__UI__[this.cache.name]
      ? globalThis.__Ziko__.__UI__[this.cache.name]?.push(this)
      : (globalThis.__Ziko__.__UI__[this.cache.name] = [this]);
    element && autoMount && this?.mount?.();
    globalThis.__Ziko__.__UI__.push(this);

    const parsed_props = parse_props(props);
    this.parsed_props = parsed_props;
    this.style(parsed_props.style);
    this.setAttr(parsed_props.attrs);
    const Events = Object.entries(parsed_props.events);
    Events.forEach(([ev, callback]) => this[ev](callback.bind(this)));
    if (items.length > 0) this.append(...items);
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
  // get attr() {
  //   return this.cache.attributes;
  // }

  get events() {
    return this.cache.events;
  }
  get html() {
    return this.element.innerHTML;
  }
  get text() {
    return this.element.textContent;
  }
  get parent() {
    return this.cache.parent;
  }
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

  destroy() {
  if (this.cache.destroyed) return this;

  this.unmount();

  this.cache.eventsController.abort();

  for (const event of Object.values(this.cache.events)) {
    event.callbacks.clear();
  }

  this.cache.events = {};
  this.cache.destroyed = true;

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
    __addItems__(UIElement, this, "append", "push", ...ele);
    return this;
  }
  prepend(...ele) {
    __addItems__(UIElement, this, "prepend", "unshift", ...ele);
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
    maintain(ctx);
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
  // Events :
  on(events, options = {}) {
  if (this.cache.destroyed) return this;

  for (let key in events) {
    if (!this.cache.events[key]) {
      const event = (this.cache.events[key] = {
        paused: false,
        callbacks: new Map(),
        pause: () => (event.paused = true),
        resume: () => (event.paused = false)
      });
    }

    const event = this.cache.events[key];
    const callbacks = event.callbacks;
    const callback = events[key];

    if (callbacks.has(callback)) continue;

    const THROTTLE_DELAY = options.throttle;
    const handler = (e) => {
      if (event.paused) return;
        callback.call(this, e, this);
    };

    callbacks.set(callback, handler);

    this.element.addEventListener(key, THROTTLE_DELAY ? throttle(handler, THROTTLE_DELAY) : handler, {
      ...options,
      signal: AbortSignal.any([
        this.cache.eventsController.signal,
        ...(options.signal ? [options.signal] : [])
      ])
    });
  }

  return this;
}
  once(events){
    return this.on(events, { once : true})
  }
  off(events) {
    for (const key of events) {
      const event = this.cache.events[key];
      if (!event) continue;
      for (const handler of event.callbacks.values()) {
        this.element.removeEventListener(key, handler);
      }
      event.callbacks.clear();
    }
    return this;
  }
}
