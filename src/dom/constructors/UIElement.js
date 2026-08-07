import { UIElementCore } from "./UIElementCore.js";
import { register_to_class } from "../../helpers/register/register-to-class.js";
import { 
  LifecycleMethods,
  AttrsMethods,
  DomMethods,
  IndexingMethods,
  StyleMethods,
} from "./mixins/index.js";

import {
  EventController,
  PtrListeners,
  ClickListeners,
  KeyListeners,
  ViewListeners,
} from '../../events/index.js'
class UIElement extends UIElementCore{
  constructor({element, name ='', type = 'html', render = __Ziko__.__Config__.default.render, props}={}){
    super()
    this.exp = {
      events : {

      }
    }
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
    )
    if(category && !this.exp.events.hasOwnProperty(category)) this.exp.events[category] = new EventController(this, category);
    isCustom && this.exp.events[category].cache.customEvents.add(event_name)
    const EVENT = this.exp.events[category];
    EVENT.addListener(event_name, (e)=>{
      if(details_setter) details_setter(EVENT);
      callback(e)
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
export { UIElement }
