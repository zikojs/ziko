export class EventController {
  constructor(target, category){
    this.cache = {
      category,
      target,
      listeners : {},
      currentEvent : null,
      event : null,
      customEvents : new Set()
    }
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
        if(this.cache.listeners[event_name].preventDefault) e.preventDefault()
        if(!this.cache.listeners[event_name].paused) {
          this.cache.currentEvent = event_name;
          callback.call(this, this)
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