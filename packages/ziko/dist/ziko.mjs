
/*
  Project: ziko.js
  Author: Zakaria Elalaoui
  Date : Sat Aug 29 2026 16:04:52 GMT+0100 (UTC+01:00)
  Git-Repo : https://github.com/zakarialaoui10/ziko.js
  Git-Wiki : https://github.com/zakarialaoui10/ziko.js/wiki
  Released under MIT License
*/

class UINode {
    constructor(node){
        this.cache = {
            node
        };
    }
    isUINode(){
        return true
    }
    get node(){
        return this.cache.node;
    } 
}

// globalThis.node = (node) => new UINode(node);

function parseQueryParams(queryString) {
    const params = {};
    queryString.replace(/[A-Z0-9]+?=([\w|:|\/\.]*)/gi, (match) => {
        const [key, value] = match.split('=');
        params[key] = value;
    });
    return params;
}

function defineParamsGetter(target ){
    Object.defineProperties(target, {
        'QueryParams': {
            get: function() {
                return parseQueryParams(globalThis.location.search.substring(1));
            },
            configurable: false,
            enumerable: true 
        },
        'HashParams': {
            get: function() {
                const hash = globalThis.location.hash.substring(1);
                return hash.split("#");
            },
            configurable: false,
            enumerable: true 
        }
    });
}

class UIStore extends Array {
    constructor(...args) {
        super(...args); 
    }
    clear(){
        this.length = 0;
        return this;
    }
    getItemById(id) {
        return this.find(n => n.element.id === id);
    }
    getItemsByTagName(tag) {
        return this.filter(n => n.element.tagName.toLowerCase() === tag.toLowerCase());
    }
    getElementsByClassName(className) {
        return this.filter(n => n.element.classList?.contains(className));
    }
    querySelector(selector) {
        const el = globalThis?.document?.querySelector(selector);
        if (!el) return null;
        return this.find(ui => ui.element === el) || null;
    }
    querySelectorAll(selector) {
        const els = globalThis?.document?.querySelectorAll(selector);
        return Array.from(els)
            .map(el => this.find(ui => ui.element === el))
            .filter(Boolean);
    }
}

// create the singleton
const __UI__ = new UIStore();

const __Config__ = {
    default:{
        target:null,
        render:true,
    },
    setDefault:function(pairs){
        const keys=Object.keys(pairs);
        const values=Object.values(pairs);
        for(let i=0; i<keys.length; i++) this.default[keys[i]]=values[i];
    },
    init:()=>{
        // document.documentElement.setAttribute("data-engine","zikojs")
    },
    renderingMode :"spa",
    isSSC : false,
};

const __HYDRATION__ = {
    store : new Map(),
    index : 0,
    register: function(component){
        this.store.set(this.index++ , component);
    },
    reset(){
        this.index = 0;
        this.store.clear();
    }
    
};

const __CACHE__ = {
    ui_index : 0,
    get_ui_index:function(){
        return this.ui_index ++
    },
    register_ui: function(UIElement){
        
    }
};

var __State__ = {
    store : new Map(),
    index : 0,
    session_storage : null,
    register: function(state){
        // if(!import.meta?.env?.SSR && import.meta?.env?.DEV){
        //     if(!this.session) this.session_storage = useSessionStorage('ziko-state', {})
        //     const savedValue = this.session_storage.get(this.index)
        //     if(!savedValue) this.session_storage.add({[this.index] : state.value});
        //     else state.value = savedValue
        // }
        // this.store.set(this.index++, state)
    },
    update: function(index, value){
    //    if(!import.meta?.env?.SSR && import.meta?.env?.DEV){
    //         this.session_storage.add({[index] : value})
    //     } 
    },

};

function __init__global__(){
    if ( !globalThis?.__Ziko__ ){
        globalThis.__Ziko__ = {
                    __UI__,
                    __HYDRATION__,
                    __State__,
                    __Config__,
                    __CACHE__,
                    __PROVIDERS__: {}
                };
        defineParamsGetter(__Ziko__);
    }
}

const parse_props = (props = {}) => {

    const result = {
        methods: {},
        events: {},
        style: {},
        attrs: {}
    };

    for (const [key, value] of Object.entries(props)) {
        if (key === "style") {
            result.style = value;
        }
        else if (key.startsWith("$")) {
            result.methods[key.slice(1)] = value;
        }
        else if (/^on[A-Z]/.test(key)) {
            result.events[key] = value;
        }
        else {
            result.attrs[key] = value;
        }
    }

    return result;
};

__init__global__();
class UIElementCore extends UINode{
  constructor(){
    super();
  }
  init({element, name, type, render, props = {}, items = []} = {}){
    this.target = globalThis.__Ziko__.__Config__.default.target||globalThis?.document?.body;
    if(typeof element === "string") {
      switch(type){
        case "html" : {
          element = globalThis?.document?.createElement(element);
          // console.log('1')
        } break;
        case "svg" : {
          element = globalThis?.document?.createElementNS("http://www.w3.org/2000/svg", element); 
          // console.log('2')
        } break;
        default : throw Error("Not supported")
      }
    }
    else this.target = element?.parentElement;
    Object.assign(this.cache, {
      name,
      itemsTarget : this,
      isInteractive : false,
      parent:null,
      isBody:false,
      isRoot:false,
      isHidden: false,
      isFrozzen:false,
      attributes: {},
      filters: {},
      temp:{}
    });
    this.events = {
      ptr:null,
      mouse:null,
      wheel:null,
      key:null,
      drag:null,
      drop:null,
      click:null,
      clipboard:null,
      focus:null,
      swipe:null,
      custom:null,
    };
    this.observer={
      resize:null,
      intersection:null
    };
    if(element) Object.assign(this.cache,{element});
    this.items = new UIStore();
    globalThis.__Ziko__.__UI__[this.cache.name]
      ? globalThis.__Ziko__.__UI__[this.cache.name]?.push(this)
      : globalThis.__Ziko__.__UI__[this.cache.name]=[this];
    element && render && this?.render?.();
    globalThis.__Ziko__.__UI__.push(this);

    // console.log({props})
    const parsed_props = parse_props(props);

    this.parsed_props = parsed_props;

    this.style(parsed_props.style);
    this.setAttr(parsed_props.attrs);

    const Events = Object.entries(parsed_props.events);

    Events.forEach(([ev, callback]) => this[ev](callback.bind(this)));
    

    if(items.length > 0) this.append(...items);
  }
  get element(){
    return this.cache.element;
  }
  [Symbol.iterator](){
    return this.items[Symbol.iterator]();
  }
  maintain() {
    for (let i = 0; i < this.items.length; i++) {
      Object.defineProperty(this, i, {
        value: this.items[i],
        writable: true,
        configurable: true,
        enumerable: false 
        });
    }
  }
  isInteractive(){
    return this.cache.isInteractive;
  }
  isUIElement(){
    return true;
  }
}

function register_to_class(target, ...mixins){
    mixins.forEach(n => _register_to_class_(target, n));
}
function _register_to_class_(target, mixin) {
  const descriptors = Object.getOwnPropertyDescriptors(mixin);
  for (const key of Reflect.ownKeys(descriptors)) {
    const desc = descriptors[key];
    if ('get' in desc || 'set' in desc || typeof desc.value !== 'function') {
      Object.defineProperty(Object.getPrototypeOf(target), key, desc);
    } else if (typeof desc.value === 'function') {
      if (!Object.getPrototypeOf(target).hasOwnProperty(key)) {
        Object.defineProperty(Object.getPrototypeOf(target), key, desc);
      }
    }
  }
}

// export function mount(target = this.target) {
//   if(this.isBody) return ;
//   if(target?.isUIElement)target=target.element;
//   this.target=target;
//   this.target?.appendChild(this.element);
//   return this;
// }
// export function unmount(){
//   if(this.cache.parent)this.cache.parent.remove(this);
//   else if(this.target?.children?.length && [...this.target?.children].includes(this.element)) this.target.removeChild(this.element);
//   return this;
// }

// export function mountAfter(target = this.target, t = 1) {
//   setTimeout(() => this.mount(), t);
//   return this;
// }
// export function unmountAfter(t = 1) {
//   setTimeout(() => this.unmount(), t);
//   return this;
// }

function mount(target = this.target, delay = 0) {
    if (delay > 0) {
        setTimeout(() => this.mount(target, 0), delay);
        return this;
    }

    if (this.isBody) return this;

    if (target?.isUIElement) target = target.element;
    this.target = target;

    this.target?.appendChild(this.element);
    return this;
}

function unmount(delay = 0) {
    if (delay > 0) {
        setTimeout(() => this.unmount(0), delay);
        return this;
    }

    if (this.cache.parent) {
        this.cache.parent.remove(this);
    } else if (
        this.target?.children?.length &&
        [...this.target.children].includes(this.element)
    ) {
        this.target.removeChild(this.element);
    }

    return this;
}

var LifecycleMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    mount: mount,
    unmount: unmount
});

const STATE_GETTER = Symbol.for("ziko/hooks/STATE_GETTER");

// import { __init__global__ } from "../__ziko__/index.js";


function useState(initialValue) {
    const state = {
        value: initialValue,
        subscribers: new Set(),
        paused: false,
    };

    function getValue() {
        return {
            value: state.value,
            _subscribe: (fn) => {
                state.subscribers.add(fn);
                return () => state.subscribers.delete(fn);
            },
        };
    }

    getValue[STATE_GETTER] = true;

    function setValue(newValue) {
        if (state.paused) return;

        if (typeof newValue === "function") {
            newValue = newValue(state.value);
        }

        if (!Object.is(newValue, state.value)) {
            state.value = newValue;
            state.subscribers.forEach((fn) => fn(state.value));
        }
    }

    const controller = {
        pause: () => { state.paused = true; },
        resume: () => { state.paused = false; },
        clear: () => { state.subscribers.clear(); },
        force: (newValue) => {
            if (typeof newValue === "function") {
                newValue = newValue(state.value);
            }

            state.value = newValue;
            state.subscribers.forEach((fn) => fn(state.value));
        },
        getSubscribers: () => new Set(state.subscribers),
    };

    return [getValue, setValue, controller];
}

const isStateGetter = (arg) => typeof arg === "function" && arg[STATE_GETTER] === true;

// import { 
//   is_camelcase,
//   camel2hyphencase
//  } from '../../../data/string/index.js'

function setAttr(name, value) {
  if(name instanceof Object){
    const [names,values]=[Object.keys(name),Object.values(name)];
    for(let i=0;i<names.length;i++){
      if(values[i] instanceof Array)value[i] = values[i].join(" ");
      _set_attrs_.call(this, names[i], values[i]);
    }
  }
  else {
    if(value instanceof Array) value = value.join(" ");
    _set_attrs_.call(this, name, value);
  }
  return this;
}
function removeAttr(...names) {
  for(let i=0;i<names.length;i++)this.element?.removeAttribute(names[i]);
  return this;
}
function getAttr(name){
  // name = is_camelcase(name) ? camel2hyphencase(name) : name;
  return this.element.attributes[name].value;
}
function setContentEditable(bool = true) {
  this.setAttr("contenteditable", bool);
  return this;
}


function _set_attrs_(name, value){
    if(globalThis.SVGAElement && this.element instanceof globalThis.SVGAElement) name = is_camelcase(name) ? camel2hyphencase(name) : name;
    if(this?.attr[name] && this?.attr[name]===value) return;
    if(isStateGetter(value)){
        const getter = value();
        getter._subscribe(
            (newValue) => this.element?.setAttribute(name, newValue),
            this 
        );
    }
    else this.element?.setAttribute(name, value);
    Object.assign(this.cache.attributes, {[name]:value});   
}

var AttrsMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    _set_attrs_: _set_attrs_,
    getAttr: getAttr,
    removeAttr: removeAttr,
    setAttr: setAttr,
    setContentEditable: setContentEditable
});

class ZikoUIText extends UINode {
    constructor(...value) {
      super("span", "text", false, ...value);
      this.element = globalThis?.document?.createTextNode(...value);
    }
    isText(){
      return true
    }
}
const text = (...str) => new ZikoUIText(...str);

function append(...ele) {
  __addItem__.call(this, "append", "push", ...ele);
  return this;
}
function prepend(...ele) {
  this.__addItem__.call(this, "prepend", "unshift", ...ele);
  return this;
}
function insertAt(index, ...ele) {
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
function remove(...ele) {
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
function clear(){
  this?.items?.forEach(n=>n.unmount());
  this.itemsTarget.element.innerHTML = '';
  return this;
}
function replaceElementWith(new_element){
    this.cache.element.replaceWith(new_element);
    this.cache.element = new_element;
    // To do : Dispose Events and States 
    return this
}
function after(ui){
  if(ui?.isUIElement) ui=ui.element;
  this.itemsTarget.element?.after(ui);
  return this;
}
function before(ui){
  if(ui?.isUIElement) ui=ui.element;
  this.itemsTarget.element?.before(ui);
  return this;
}
async function __addItem__(adder, pusher, ...ele) {
  const itemsTarget_el = this.itemsTarget.element;
  const itemsTarget = this.itemsTarget;
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
      const UIEle = await ele[i];
      UIEle.cache.parent = this;
      itemsTarget_el?.[adder](UIEle.element);
      UIEle.target = this.itemsTarget.element;
      itemsTarget.items[pusher](UIEle);
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

var DomMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    __addItem__: __addItem__,
    after: after,
    append: append,
    before: before,
    clear: clear,
    insertAt: insertAt,
    prepend: prepend,
    remove: remove,
    replaceElementWith: replaceElementWith
});

function at(index) {
  return this.items.at(index);
}
function forEach(callback) {
  this.items.forEach(callback);
  return this;
}
function map(callback) {
  return this.items.map(callback);
}
function find(condition) {
  return this.items.filter(condition);
}

var IndexingMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    at: at,
    find: find,
    forEach: forEach,
    map: map
});

function style$1(styles){
    if(!this.element?.style) return this;
    for(let key in styles){
        const value = styles[key];
        if(isStateGetter(value)){
            const getter = value();
            Object.assign(this.element.style, {[key] : getter.value});
            getter._subscribe(
                (newValue) => {
                    console.log({newValue});
                    Object.assign(this.element.style, {[key] : newValue});
                },
                // this 
            );
        }
        else Object.assign(this.element.style, {[key] : value});
    }
    return this;
}
function size(width, height){
    return this.style({width, height})
}
function hide(){

}
function show(){

}
function animate(keyframe, {duration=1000, iterations=1, easing="ease"}={}){
    this.element?.animate(keyframe,{duration, iterations, easing});
    return this;
}

var StyleMethods = /*#__PURE__*/Object.freeze({
    __proto__: null,
    animate: animate,
    hide: hide,
    show: show,
    size: size,
    style: style$1
});

class EventController {
  constructor(target, category){
    this.cache = {
      category,
      target,
      listeners : {},
      currentEvent : null,
      event : null,
      customEvents : new Set()
    };
  }
  get event(){
    return this.cache.event
  }
  get target(){
    return this.cache.target;
  }
  get element(){
    return this.cache.target.element;
  }
  get currentEvent(){
    return this.cache.currentEvent;
  }
  addListener(event_name, callback, {preventDefault = false, paused = false} = {}){
    this.cache.listeners[event_name] = {
      callback : e =>{
        this.cache.event = e;
        if(this.cache.listeners[event_name].preventDefault) e.preventDefault();
        if(!this.cache.listeners[event_name].paused) {
          this.cache.currentEvent = event_name;
          callback.call(this, this);
        }
      },
      preventDefault,
      paused,
    };
    this.element.addEventListener(event_name, this.cache.listeners[event_name].callback);
    return this;
  }
  removeListener(event_name){
    this.element.removeEventListener(event_name, this.cache.listeners[event_name].callback);
    return this;
  }
  pause(event_name){
    this.cache.listeners[event_name].paused = true;
    return this;
  }
  resume(event_name){
    this.cache.listeners[event_name].paused = false;
    return this;
  }
  preventDefault(event_name){
    // if(!event_name) 
    this.cache.listeners[event_name].preventDefault = true;
    return this;
  }
  useDefault(event_name){
    this.cache.listeners[event_name].preventDefault = false;
    return this;
  }
}

class ClickAwayEvent extends Event {
  constructor(originalEvent, targetElement) {
    super("clickaway", { bubbles: true, cancelable: true });
    this.originalEvent = originalEvent;
    this.targetElement = targetElement;
  }
}

function register_click_away_event(element) {
  // console.log(element)
  function handler(e) {
    if (!element.contains(e.target)) {
      const clickAwayEvent = new ClickAwayEvent(e, element);
      element.dispatchEvent(clickAwayEvent);
    }
  }

  globalThis?.document?.addEventListener("click", handler);

  return () => globalThis?.document?.removeEventListener("click", handler);
  
}

// // Example usage
// const box = document.querySelector("#my-box");

// const stop = listenClickAway(box);

// box.addEventListener("clickaway", (e) => {
//   console.log("Clicked outside box!", e);
// });

// // later, you can stop listening:
// // stop();

const getCoordinates = (ctx, normalized = false) =>{
    const rect = ctx.element.getBoundingClientRect();
    const e = ctx.event;
    let x = (e?.clientX - rect.left) | 0;
    let y = (e?.clientY - rect.top) | 0;

    if(normalized){
        const w = ctx.element.clientWidth;
        const h = ctx.element.clientHeight;
        x = +((x / w) * 2 - 1).toFixed(8);
        y = +((y / h) * -2 + 1).toFixed(8);
    }

    return {x, y};
};

const isCustomEventRegistred = (ctx, category, event_name) => ctx.exp.events?.[category]?.cache?.customEvents?.has(event_name);

const CATEGORY$3 = 'click';
const ClickListeners = {
    onClick(callback){
        return this.on(
            'click', callback, 
            { category : CATEGORY$3 })
    },
    onDblClick(callback){
        return this.on(
            'dblclick', callback, 
            { category : CATEGORY$3})
    },
    onClickAway(callback){
        if(!isCustomEventRegistred(this, CATEGORY$3, 'clickaway')) register_click_away_event(this.element);
        return this.on(
            'clickaway', callback, 
            { category : CATEGORY$3, isCustom : true})
    },
};

const CATEGORY$2 = 'ptr';
const PtrListeners = {
    onPtrDown(callback, useNormalizedCoordinates = false){
        return this.on(
            'pointerdown', callback, 
            { category : CATEGORY$2, details_setter : (ctx)=> {
                const {x, y} = getCoordinates(ctx, useNormalizedCoordinates);
                ctx.dx = x;
                ctx.dy = y;
                ctx.isDown = true;
                ctx.isDragging = ctx.isMoving ?? false;
            }}
        )
    },
    onPtrMove(callback, useNormalizedCoordinates = false){
        return this.on(
            'pointermove', callback, 
            { category : CATEGORY$2, details_setter : (ctx)=> {
                const {x, y} = getCoordinates(ctx, useNormalizedCoordinates);
                ctx.mx = x;
                ctx.my = y;
                ctx.isMoving = true;
                ctx.isDragging = ctx.isDown ?? false;
            }}
        )
    },
    onPtrUp(callback, useNormalizedCoordinates = false){
        return this.on(
            'pointerup', callback, 
            { category : CATEGORY$2, details_setter : (ctx)=> {
                const {x, y} = getCoordinates(ctx, useNormalizedCoordinates);
                ctx.ux = x;
                ctx.uy = y;
                ctx.isDown = false;
                ctx.isMoving = false;
                ctx.isDragging = false;
            }}
        )
    }
};

const CATEGORY$1 = 'key';
const KeyListeners = {
    onKeyDown(callback){
        return this.on(
            'keydown', callback, 
            { category : CATEGORY$1, details_setter : ctx=> { ctx.kd = ctx.event.key; }
        })
    },
    onKeyPress(callback){
        return this.on(
            'keypress', callback, 
            { category : CATEGORY$1, details_setter : ctx=> { ctx.kp = ctx.event.key; }
        })
    },
    onKeyUp(callback){
        return this.on(
            'keydown', callback, 
            { category : CATEGORY$1, details_setter : ctx=> { ctx.ku = ctx.event.key; }
        })
    },
    
};

// import { throttle } from "../../time/decorators/index.js";
const throttle = (x) => x; 
class ViewEvent extends CustomEvent {
    constructor(type, detail, { bubbles = true, cancelable = true } = {}) {
        super(type, { detail, bubbles, cancelable });
    }
}

function register_view_event(
    element,
    {
        intersection = true,
        resize = true,
        threshold = 0,
        throttleResize = 100,
        throttleEnterExit = 0
    } = {}
) {
    let intersectionObserver, resizeObserver;
    const resizeCallback = entries => {
        for (let entry of entries) {
            const { width, height } = entry.contentRect;

            element.dispatchEvent(
                new ViewEvent("resizeview", {
                    width,
                    height,
                    entry
                })
            );
        }
    };

    const throttledResize = throttleResize > 0
        ? throttle(resizeCallback)
        : resizeCallback;

    const intersectionCallback = entries => {
        for (let entry of entries) {
            const type = entry.isIntersecting ? "enterview" : "exitview";
            element.dispatchEvent(new ViewEvent(type, entry));
        }
    };

    const throttledIntersections = throttleEnterExit > 0
        ? throttle(intersectionCallback)
        : intersectionCallback;

    if (intersection) {
        intersectionObserver = new IntersectionObserver(throttledIntersections, { threshold });
        intersectionObserver.observe(element);
    }

    if (resize) {
        resizeObserver = new ResizeObserver(throttledResize);
        resizeObserver.observe(element);
    }

    // ---- UNREGISTER ----
    return () => {
        if (intersectionObserver) {
            intersectionObserver.unobserve(element);
            intersectionObserver.disconnect();
        }
        if (resizeObserver) {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
        }
    };
}

const CATEGORY = 'view';
const ViewListeners = {
    onEnterView(callback){
        if(!this.exp.events?.[CATEGORY]) register_view_event(this.element);
        return this.on(
            'enterview', callback, 
            { category : CATEGORY, isCustom : true})
    },
    onExitView(callback){
        if(!this.exp.events?.[CATEGORY]) register_view_event(this.element);
        return this.on(
            'exitview', callback, 
            { category : CATEGORY, isCustom : true})
    },
    onResizeView(callback){
        if(!this.exp.events?.[CATEGORY]) register_view_event(this.element);
        return this.on(
            'resizeview', callback, 
            { category : CATEGORY, isCustom : true})
    },
};

class SwipeEvent extends CustomEvent {
  constructor(type, detail) {
    super(type, {
      detail,
      bubbles: true,
      cancelable: true
    });
  }
}

function register_swipe_event(
  element,
  threshold = 5,
  restraint = 100,
  allowedTime = 500
) {
  let startX = 0,
      startY = 0,
      startTime = 0,
      isPointerDown = false;

  function onPointerDown(e) {
    startX = e.clientX;
    startY = e.clientY;
    startTime = performance.now();
    isPointerDown = true;
  }

  function onPointerUp(e) {
    if (!isPointerDown) return;
    isPointerDown = false;

    const distX = e.clientX - startX;
    const distY = e.clientY - startY;
    const elapsed = performance.now() - startTime;

    let direction = null;
    let eventName = null;

    if (elapsed <= allowedTime) {
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        direction = distX < 0 ? "left" : "right";
        eventName = "swipe" + direction;
      } 
      else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
        direction = distY < 0 ? "up" : "down";
        eventName = "swipe" + direction;
      }
    }

    // Emit event
    if (eventName) {
      element.dispatchEvent(
        new SwipeEvent(eventName, {
          direction,
          distX,
          distY,
          originalEvent: e
        })
      );
    }
  }

  element.addEventListener("pointerdown", onPointerDown, { passive: true });
  element.addEventListener("pointerup", onPointerUp, { passive: true });

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointerup", onPointerUp);
  };
}

class UIElement extends UIElementCore{
  constructor({element, name ='', type = 'html', render = __Ziko__.__Config__.default.render, props}={}){
    super();
    this.exp = {
      events : {

      }
    };
    register_to_class(
      this, 
      LifecycleMethods,
      AttrsMethods, 
      DomMethods, 
      StyleMethods,
      IndexingMethods,
      PtrListeners,
      ClickListeners,
      KeyListeners,
      ViewListeners,
    );

    if(element) this.init({element, name, type, render, props});
  }
  on(event_name, callback, {details_setter, category = 'global', isCustom = false, preventDefault = false} = {}){
    if(event_name instanceof Array) event_name.forEach(
      event => this.on(
        event, 
        callback, 
        {details_setter, category, isCustom, preventDefault}
      )
    );
    if(category && !this.exp.events.hasOwnProperty(category)) this.exp.events[category] = new EventController(this, category);
    isCustom && this.exp.events[category].cache.customEvents.add(event_name);
    const EVENT = this.exp.events[category];
    EVENT.addListener(event_name, (e)=>{
      if(details_setter) details_setter(EVENT);
      callback(e);
    },{
      preventDefault
    });
    return this;
  }
  _off(event, category = 'global'){
    this.exp.events[category].removeListener(event);
    return this
  }
  get element(){
    return this.cache.element;
  }
  get itemsTarget(){
    return this.cache.itemsTarget; 
  }
  get itemsTargetElement(){
    return this.itemsTarget.element;
  }
  setItemsTarget(parent){
    this.cache.itemsTarget = parent;
    this.items = parent.items;
    return this;
  }
  isInteractive(){
    return this.cache.isInteractive;
  }
  useClient(directive){
    if(!this.cache.isInteractive){
      this.element.setAttribute('data-hydration-index', globalThis.__Ziko__.__HYDRATION__.index);
      globalThis.__Ziko__.__HYDRATION__.register(() => this);
      this.cache.isInteractive = true;
    }
    if(directive)this.element.setAttribute('data-hydration-directive', directive);
    return this;
  }
  get st(){
    return this.cache.style;
  }
  get attr(){
    return this.cache.attributes;
  }
  get evt(){
    return this.events;
  }
  get html(){
    return this.element.innerHTML;
  }
  get text(){
    return this.element.textContent;
  }
  get isBody(){
    return this.element === globalThis?.document.body;
  }
  get parent(){
    return this.cache.parent;
  }
  get width(){
    return this.element.getBoundingClientRect().width;
  }
  get height(){
    return this.element.getBoundingClientRect().height;
  }
  get top(){
    return this.element.getBoundingClientRect().top;
  }
  get right(){
    return this.element.getBoundingClientRect().right;
  }
  get bottom(){
    return this.element.getBoundingClientRect().bottom;
  }
  get left(){
    return this.element.getBoundingClientRect().left;
  }

}

const is_primitive$1 = (value) => typeof value !== 'object' && typeof value !== 'function' || value === null;

const call_with_optional_props = (Component) => {
    return (...args) => {
        const first = args[0];

        const isChild = first?.isUIElement?.() || is_primitive$1(first);

        if (isChild) {
            return new Component({}, ...args);
        }

        return new Component(first, ...args.slice(1));
    };
};

function add_vendor_prefix(property) {
	const propertyUC = property.slice(0, 1).toUpperCase() + property.slice(1);
	const vendors = ['Webkit', 'Moz', 'O', 'ms'];
	for(let i = 0, len = vendors.length; i < len; i++) {
		const vendor = vendors[i];
		if(typeof (globalThis?.document?.body).style[vendor + propertyUC] !== 'undefined') return vendor + propertyUC;
	}
	return property;
}
const normalize_css_value = value => typeof value === 'number' ? value+'px' : value;
const add_class = (UIElement, name) => UIElement.element.className = UIElement.element.className.replace(/\s+$/gi, '') + ' ' + name;
const remove_class =(UIElement, name) => UIElement.element.className = UIElement.element.className.replace(name, '');

// const addSuffixeToNumber=(value,suffixe="px")=>{
//   if(typeof value === "number") value+=suffixe;
//   if(value instanceof Array)value=value.map(n=>typeof n==="number"?n+=suffixe:n).join(" ");
//   return value;
// }

// const Id = (a) => document.getElementById(a);
// const Class = (a) => [...document.getElementsByClassName(a)];
// const $=(...selector)=>{
//   var ele=[]
//   for(let i=0;i<selector.length;i++){
//     if(typeof selector[i]=="string")ele.push(...document.querySelectorAll(selector[i]));
//     if(selector[i] instanceof UIElement)ele.push(selector[i].element)
//   }
//   return ele.length===1?ele[0]:ele;
// }

const style = (el, styles) => {if(el)Object.assign(el.style, styles);};

function script(src) {
  const Script = document?.createElement("script");
  Script.setAttribute("src", src);
  document.head.appendChild(Script);
}
function linkStyle(href) {
  const link = document?.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("href", href);
  document.head.appendChild(link);
}
const CloneElement = (UIElement) => {
  var clone = new UIElement.__proto__.constructor();
  //waitForUIElm(UIElement).then(e=>console.log(e)).then(()=>clone = new UIElement.__proto__.constructor())
  //let a = new UIElement.__proto__.constructor()
  return clone;
};
const cloneUI=UIElement=>{
  return Object.assign(Object.create(Object.getPrototypeOf(UIElement)),UIElement)
};
// function isPrimitive(value) {
//     return typeof value !== 'object' && typeof value !== 'function' || value === null;
// }
const waitElm=(UIElement)=>{
    return new Promise(resolve => {
        if (UIElement) {
            return resolve(UIElement);
        }
        const observer = new MutationObserver(() => {
            if (UIElement) {
                resolve(UIElement);
                observer.disconnect();
            }
        });
        observer.observe(document?.body, {
            childList: true,
            subtree: true
        });
    });
  };

const HTMLTags = [
  'a',
  'abb',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'blockquote',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'header',
  'hgroup',
  'hr',
  'i',
  'iframe',
  'img',
  'ipnut',
  'ins',
  'kbd',
  'label',
  'legend',
  'li',
  'main',
  'map',
  'mark',
  'menu',
  'meter',
  'nav',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'search',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'template',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr'
];

const SVGTags = [
    "svg", "g", "defs", "symbol", "use", "image", "switch",
    "rect", "circle", "ellipse", "line", "polyline", "polygon", "path",
    "text", "tspan", "textPath", "altGlyph", "altGlyphDef", "altGlyphItem", "glyph", "glyphRef",
    "linearGradient", "radialGradient", "pattern", "solidColor",
    "filter", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix",
    "feDiffuseLighting", "feDisplacementMap", "feDropShadow", "feFlood", "feFuncA", "feFuncR", "feFuncG", "feFuncB",
    "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "feSpecularLighting",
    "feTile", "feTurbulence",
    "animate", "animateMotion", "animateTransform", "set",
    "script",
    "desc", "title", "metadata", "foreignObject"
  ];

const MathMLTags = [
  'math', 'annotation', 
  `merror`,
  `mfrac`,
  `mi`, 
  `mprescripts`,
  `mn`, 
  `mo`, `mover`,
  `mpadded`, `mphantom`, `mprescripts`,
  `mroot`, `mrow`,
  `ms`, `semantics`, `mspace`, `msqrt`, `mstyle`, `msub`, `msup`, `msubsup`,
  `mtable`, `mtd`, `mtext`, `mtr`,
  `munder`, `munderover`
];

const tags = new Proxy({}, {
  get(target, prop) {
    if (typeof prop !== 'string') return undefined;
    let tag = prop.replaceAll("_","-").toLowerCase();
    let type ;
    if(HTMLTags.includes(tag)) type = 'html';
    if(SVGTags.includes(tag)) type = 'svg';
    if(MathMLTags.includes(tag)) type = 'mathml';
    return (...args) => {
      if(args.length === 0) {
        return new UIElement({element : tag, name : tag, type})
      }
      if(
        ['string', 'number'].includes(typeof args[0]) 
        || args[0] instanceof UIElement 
        || isStateGetter(args[0])
        || args[0] instanceof HTMLElement
      ) return new UIElement({element : tag, name : tag, type}).append(...args);
      return new UIElement({element : tag, type, props : args.shift()}).append(...args)
    }
  }
});

function useDerived(deriveFn, sources) {
    let value = deriveFn(...sources.map(s => s().value));
    const subscribers = new Set();

    // const unsubscribers = sources.map(source => {
    //     const srcValue = source();

    //     return srcValue._subscribe(() => {
    //         const newVal = deriveFn(...sources.map(s => s().value));

    //         if (!Object.is(newVal, value)) {
    //             value = newVal;
    //             subscribers.forEach(fn => fn(value));
    //         }
    //     });
    // });

    const getter = () => ({
        value,
        _subscribe: (fn) => {
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        },
    });

    getter[STATE_GETTER] = true;
    return getter
}

const is_primitive = value => typeof value !== 'object' && typeof value !== 'function' || value === null;

const mapfun=(fun,...X)=>{
    const Y=X.map(x=>{
        if(is_primitive(x) || x?.__mapfun__) return fun(x)
        if(x instanceof Array) return x.map(n=>mapfun(fun,n));
        if(ArrayBuffer.isView(x)) return x.map(n=>fun(n));
        if(x instanceof Set) return new Set(mapfun(fun,...[...x]));
        if(x instanceof Map) return new Map([...x].map(n=>[n[0],mapfun(fun,n[1])]));
        if(x.isMatrix?.()) return new x.constructor(x.rows, x.cols, mapfun(x.arr.flat(1)))
        else if(x instanceof Object){
            return Object.fromEntries(
                Object.entries(x).map(
                    n=>n=[n[0],mapfun(fun,n[1])]
                )
            )
        }
    });
   return Y.length==1? Y[0]: Y; 
};

const apply_fun = (x, fn) => {
    if (x.isComplex?.()) return new x.constructor(
        fn(x.a),
        fn(x.b)
    )
    if (x.isMatrix?.()) return new x.constructor(
        x.rows,
        x.cols,
        x.arr.flat(1).map(fn)
    )
    if (x instanceof Array) mapfun(fn, ...x);
    return fn(x)
};

const useReactive = (nested_value) => mapfun(
    n => {
        const state = useState(n);
        return {
            get : state[0],
            set : state[1],
        }
    }, 
    nested_value
);

const useEffect = (callback, deps = []) =>{
    const states = deps.filter(isStateGetter);

    let cleanup;

    const execute = () => {
        // Cleanup previous effect
        if (typeof cleanup === "function") {
            cleanup();
        }

        // Read current state values
        const values = states.map(state => state().value);

        // Execute effect
        cleanup = callback(...values);
    };

    // Subscribe to states
    const unsubscribers = states.map(state =>
        state()._subscribe(execute)
    );

    // Initial execution
    execute();

    // Return effect cleanup
    return () => {
        unsubscribers.forEach(unsubscribe => {
            unsubscribe();
        });

        if (typeof cleanup === "function") {
            cleanup();
            cleanup = undefined;
        }
    };
};

class UseEventEmitter {
    constructor(maxListeners = 10) {
        this.events = {};
        this.maxListeners = maxListeners;
    }

    on(event, listener) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
        if (this.events[event].length > this.maxListeners) {
            console.warn(`Warning: Possible memory leak. Event '${event}' has more than ${this.maxListeners} listeners.`);
        }
        return this;
    }

    once(event, listener) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            listener(...args);
        };
        return this.on(event, wrapper);
    }

    off(event, listener) {
        const listeners = this.events[event];
        if (!listeners) return this;

        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
        }

        return this;
    }

    emit(event, data) {
        const listeners = this.events[event];
        if (!listeners) return false;

        // Make a copy so removing listeners inside callbacks doesn't affect iteration
        [...listeners].forEach(listener => {
            try {
                listener(data);
            } catch (e) {
                console.error(`Error in listener for '${event}':`, e);
            }
        });

        return true;
    }
    remove(event){
        delete this.events[event];  
        return this; 
    }
    clear() {
        this.events = {};
        return this;
    }

    setMaxListeners(max) {
        this.maxListeners = max;
        return this;
    }
}

const useEventEmitter = (maxListeners) => new UseEventEmitter(maxListeners);

// export * from "./math/index.js";

if(globalThis?.document){
    document?.addEventListener("DOMContentLoaded", __Ziko__.__Config__.init());
}

// import './math/functions/proxy.js'

export { ClickAwayEvent, ClickListeners, CloneElement, EventController, KeyListeners, PtrListeners, SwipeEvent, UIElement, UINode, ViewEvent, ViewListeners, ZikoUIText, add_class, add_vendor_prefix, apply_fun, call_with_optional_props, cloneUI, isStateGetter, is_primitive$1 as is_primitive, linkStyle, mapfun, normalize_css_value, parse_props, register_click_away_event, register_swipe_event, register_view_event, remove_class, script, style, tags, text, useDerived, useEffect, useEventEmitter, useReactive, useState, waitElm };
