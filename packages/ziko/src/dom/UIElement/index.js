import { register_to_class } from '../../internal-utils/register/register-to-class.js';
import * as AttrsMethods from '../mixins/attrs.js';
import {
  EventController,
  PtrListeners,
  ClickListeners,
  KeyListeners,
  ViewListeners,
} from '../../events/index.js';
import { isStateGetter } from '../../hooks/state/use-state/index.js';
import { text } from '../text/index.js';
import { UINode } from '../UINode/index.js';
import {__init__global__} from '../../__ziko__/index.js';
import { UIStore } from '../../__ziko__/__ui__.js';
import { parse_props } from '../internal-utils/parse_props.js';

import {
  __addItems__,
  // __addItem__,
  maintain
} from './utils.js'

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
    this.exp = {
      events: {},
    };
    register_to_class(
      this,
      AttrsMethods,
      PtrListeners,
      ClickListeners,
      KeyListeners,
      ViewListeners,
    );

    if (element) this.init({ element, name, type, autoMount, props });
  }
  init({element, name, type, autoMount, props = {}, items = []} = {}){
      this.target = globalThis.__Ziko__.__Config__.default.target||globalThis?.document?.body;
      if(typeof element === 'string' && globalThis?.document) {
        switch(type){
          case 'html' : element = document.createElement(element); break;
          case 'svg' : element = document.createElementNS('http://www.w3.org/2000/svg', element); break;
          default : throw Error('Not supported')
        }
      }
      else this.target = element?.parentElement;
      Object.assign(this.cache, {
        name,
        itemsTarget : this,
        isInteractive : false,
        parent:null,
        // isBody:false,
        // isRoot:false,
        // isHidden: false,
        // isFrozzen:false,
        // attributes: {},
        // filters: {},
        // temp:{}
      })
      // this.events = {
      //   ptr:null,
      //   mouse:null,
      //   wheel:null,
      //   key:null,
      //   drag:null,
      //   drop:null,
      //   click:null,
      //   clipboard:null,
      //   focus:null,
      //   swipe:null,
      //   custom:null,
      // }
      // this.observer={
      //   resize:null,
      //   intersection:null
      // }
      if(element) Object.assign(this.cache,{element});
      this.items = new UIStore();
      globalThis.__Ziko__.__UI__[this.cache.name]
        ? globalThis.__Ziko__.__UI__[this.cache.name]?.push(this)
        : globalThis.__Ziko__.__UI__[this.cache.name]=[this];
      element && autoMount && this?.mount?.()
      globalThis.__Ziko__.__UI__.push(this)
      
      const parsed_props = parse_props(props);
      this.parsed_props = parsed_props;
      this.style(parsed_props.style);
      this.setAttr(parsed_props.attrs);
      const Events = Object.entries(parsed_props.events);
      Events.forEach(([ev, callback]) => this[ev](callback.bind(this)))
      if(items.length > 0) this.append(...items)
    }
  
  on(
    event_name,
    callback,
    {
      details_setter,
      category = 'global',
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
  off(event, category = 'global') {
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
    __addItems__(UIElement, this, 'append', 'push', ...ele);
    return this;
  }
  prepend(...ele) {
    __addItems__(UIElement, this, 'prepend', 'unshift', ...ele);
    return this;
  }
  insertAt(index, ...ele) {
    const target = this.itemsTarget;
    if (index >= target.items.length) return this.append(...ele);
    for (let i = 0; i < ele.length; i++) {
      if (['number', 'string'].includes(typeof ele[i])) ele[i] = text(ele[i]);
      target.element?.insertBefore(ele[i].element, target.items[index].element);
      target.items.splice(index, 0, ele[i]);
    }
    maintain(ctx);
    return this;
  }
  remove(...ele) {
    const remove = (ele) => {
      if (typeof ele === 'number') ele = this.items[ele];
      if (ele?.isUIElement) this.itemsTarget.element?.removeChild(ele.element);
      this.items = this.items.filter((n) => n !== ele);
    };
    for (let i = 0; i < ele.length; i++) remove(ele[i]);
    for (let i = 0; i < this.items.length; i++)
      Object.assign(this, { [[i]]: this.items[i] });
    // Remove from item
    return this;
  }

}

