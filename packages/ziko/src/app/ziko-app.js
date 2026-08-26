// import { ZikoHead , useHead} from "../reactivity/hooks/head/index.js";
class ZikoApp {
    constructor({head = null, wrapper = null, target = null}){
        this.head = head;
        this.wrapper = wrapper;
        this.target = target;
        this.init()        
    }
    get isZikoApp(){
        return true;
    }
    init(){
        this.head && this.setHead(this.head);
        this.wrapper && this.setWrapper(this.wrapper);
        this.target && this.setTarget(this.target);
        if(this.wrapper && this.target)this.wrapper.mount(this.target);
    }
    setTarget(target){
        if(target instanceof HTMLElement) this.target = target;
        else if (typeof target === "string") this.target = globalThis?.document?.querySelector(target);
        return this;
    }
    setWrapper(wrapper){
        if(wrapper?.isUIElement) this.wrapper = wrapper;
        else if(typeof wrapper === "function") this.wrapper = wrapper();
        return this;
    }
    // setHead(head){
    //     if(head instanceof ZikoHead) this.head = head;
    //     else this.head = useHead(head);
    //     return this;  
    // }
    
}
const App = ({head, wrapper, target}) => new ZikoApp({head, wrapper, target})
export{
    ZikoApp,
    App
}