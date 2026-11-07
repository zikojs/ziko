import { isStateGetter } from '../../hooks/state/use-state/index.js';
import { UINode } from '../UINode/index.js';
import { __init__global__ } from '../../__ziko__/index.js';
import { UIStore } from '../../__ziko__/__ui__.js';
import { parse_props } from '../utils/internal.js';
import { _addItems_, maintain, _setAttr_, _insertAt_ } from './utils.js';
import { throttle } from '../../time/throttle/index.js';
import { NAMESPACES, ATTRIBUTE_NAMESPACES } from './ns.js';
import {
  registerClickAwayEvent,
  registerResizeEvent,
  registerViewEvents,
  registerPtrEvents,
  registerAttrUpdateEvent,
} from '../../hooks/events/index.js';

import { camel2hyphencase } from '../../string/index.js';

__init__global__();

export class UIElement extends UINode {
  constructor({
    element,
    name = '',
    type = 'html',
    autoMount = __Ziko__.__Config__.default.autoMount,
    props,
  } = {}) {
    super();
    if(element) this.init({ element, name, type, autoMount, props });
    if(this.element instanceof globalThis.Element) {
        registerClickAwayEvent(this.element);
        registerResizeEvent(this.element);
        registerViewEvents(this.element);
        registerPtrEvents(this.element);
        registerAttrUpdateEvent(this.element);
    }
  }
  init({ element, name, type, autoMount, props = {}, items = [] } = {}) {
    this.target =
      globalThis.__Ziko__.__Config__.default.target ||
      globalThis?.document?.body;

    if (typeof element === 'string' && globalThis.document) {
      if (type === 'html') element = document.createElement(element);
      else {
        const namespace = NAMESPACES[type];
        if (namespace === undefined)
          throw Error(`Unsupported namespace: ${type}`);
        else element = document.createElementNS(namespace, element);
      }
    } else this.target = element?.parentElement;
    Object.assign(this.cache, {
      name,
      itemsTarget: this,
      isInteractive: false,
      parent: null,
      events: {},
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
        'data-hydration-index',
        globalThis.__Ziko__.__HYDRATION__.index,
      );
      globalThis.__Ziko__.__HYDRATION__.register(() => this.constructor);
      this.cache.isInteractive = true;
    }
    if (directive)
      this.element.setAttribute('data-hydration-directive', directive);
    return this;
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
    for (const event of Object.values(this.cache.events))
      event.callbacks.clear();
    this.cache.events = {};
    this.cache.destroyed = true;
    return this;
  }
  // Attrs
  setAttr(name, value) {
    if (typeof name === 'string') _setAttr_(this, name, value);
    else {
      for (let key in name) {
        _setAttr_(this, key, name[key]);
      }
    }
    return this;
  }
  removeAttr(...attrs) {
    for (const name of attrs) {
      const ns = ATTRIBUTE_NAMESPACES[name.split(':')[0]];
      if (ns) this.element?.removeAttributeNS(ns, name.split(':').pop());
      else this.element?.removeAttribute(name);
    }
    return this;
  }

  get attr() {
    const element = this.element;

    return new Proxy({}, {
      get(_, name) {
        if (typeof name !== 'string') return undefined;

        if (name.startsWith('data') || name.startsWith('aria')) {
          name = camel2hyphencase(name);
        }

        const ns = ATTRIBUTE_NAMESPACES[name.split(':')[0]];

        return ns
          ? element?.getAttributeNS(ns, name.split(':').pop())
          : element?.getAttribute(name);
      },

      has(_, name) {
        if (typeof name !== 'string') return false;

        const ns = ATTRIBUTE_NAMESPACES[name.split(':')[0]];

        return ns
          ? element?.hasAttributeNS(ns, name.split(':').pop()) ?? false
          : element?.hasAttribute(name) ?? false;
      }
    });
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
    _addItems_(UIElement, this, 'append', 'push', ...ele);
    return this;
  }
  prepend(...ele) {
    _addItems_(UIElement, this, 'prepend', 'unshift', ...ele.reverse());
    return this;
  }
  insertAt(index, ...elements) {
    _insertAt_(UIElement, this, index, ...elements);
    return this;
  }
  insertBefore(reference, ...elements) {
    const { items } = this.cache.itemsTarget;
    const index = items.indexOf(reference);
    if (index === -1) return this;
    _insertAt_(UIElement, this, index, ...elements);
    return this;
  }
  insertAfter(reference, ...elements) {
    const { items } = this.cache.itemsTarget;
    const index = items.indexOf(reference);
    if (index === -1) return this;
    _insertAt_(UIElement, this, index + 1, ...elements);
    return this;
  }
  remove(...elements) {
    const { element, items } = this.itemsTarget;

    const targets = elements.map(item =>
      typeof item === 'number' ? items.at(item) : item
    );

    for (const item of new Set(targets)) {
      if (!item?.isUINode) continue;

      if (item.element?.parentNode === element) {
        element.removeChild(item.element);
      }

      const index = items.indexOf(item);
      if (index !== -1) items.splice(index, 1);

      item.cache.parent = null;
      item.target = null;
    }

    maintain(this);
    return this;
  }
// Events :
on(events, options = {}) {
  if (this.cache.destroyed || !this.element) return this;

  const { throttle: delay, signal, ...listenerOptions } = options;
  if (signal?.aborted || this.cache.eventsController.signal.aborted) return this;

  for (const [key, callback] of Object.entries(events)) {
    if (typeof callback !== 'function') continue;

    let event = this.cache.events[key];

    if (!event) {
      event = this.cache.events[key] = {
        paused: false,
        callbacks: new Map(),
        pause() { this.paused = true; },
        resume() { this.paused = false; }
      };
    }

    const { callbacks } = event;
    if (callbacks.has(callback)) continue;

    const controller = new AbortController();

    const cleanup = () => {
      callbacks.delete(callback);
      controller.abort();
    };

    const handler = e => {
      if (listenerOptions.once) cleanup();
      if (event.paused) return;
      callback.call(this, e, this);
    };

    const listener = delay ? throttle(handler, delay) : handler;

    callbacks.set(callback, { controller, listener });

    this.cache.eventsController.signal.addEventListener('abort', cleanup, { once: true });
    signal?.addEventListener('abort', cleanup, { once: true });

    this.element.addEventListener(key, listener, {
      ...listenerOptions,
      signal: controller.signal
    });
  }

  return this;
}

once(events, options = {}) {
  return this.on(events, { ...options, once: true });
}

emit(event, data, options = {}) {
  if (this.cache.destroyed || !this.element) return this;

  this.element.dispatchEvent(new CustomEvent(event, {
    detail: data,
    bubbles: options.bubbles ?? false,
    cancelable: options.cancelable ?? false,
    composed: options.composed ?? false
  }));

  return this;
}

off(...events) {
  if (this.cache.destroyed) return this;

  const keys = events.length
    ? events.flat(Infinity)
    : Object.keys(this.cache.events);

  for (const key of keys) {
    const event = this.cache.events[key];
    if (!event) continue;

    for (const { controller } of event.callbacks.values()) {
      controller.abort();
    }

    event.callbacks.clear();
  }

  return this;
}
}
