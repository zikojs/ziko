import { text } from "../dom/index.js";
import { dynamicRoutesParser,routesMatcher,isDynamic } from "./routes.js";
import { ZikoApp } from "./ziko-app.js";
class ZikoSPA extends ZikoApp{
    constructor({head, wrapper, target, routes}){
        super({head, wrapper, target})
        this.routes=new Map([
            ["404",text("Error 404")],
            ...Object.entries(routes)
        ]);
        this.clear();
        globalThis.onpopstate = this.mount(location.pathname);
    }
    clear(){
        [...this.routes].forEach(n=>{
            !isDynamic(n[0]) && n[1]?.isUIElement && n[1].unmount()
        })   
        // this.wrapper.clear();
        return this;
    }
    mount(path){
        const [mask, callback] = [...this.routes].find(route=>routesMatcher(route[0],path));
        let element ;
        if(isDynamic(mask)){
            const params = dynamicRoutesParser(mask, path)
            element = callback.call(this,params)
        }
        else {
            callback?.isUIElement && callback.mount(this.wrapper); 
            if(typeof callback === "function") element = callback();  
        }
        if(element?.isUIElement) element.mount(this.wrapper);
        // if(element?.isZikoApp) element.mount(this.wrapper);
        if(element instanceof Promise){
            element.then(e=>e.mount(this.wrapper))
        }
        globalThis.history.pushState({}, "", path);
        return this;
    }
}
const SPA=({head, wrapper, target, routes})=>new ZikoSPA({head, wrapper, target, routes});

export {
    ZikoSPA,
    SPA
}


/*
 // Static 
  S.get("/url",wrapper)
// Dynamique 
 s.get("/url/name/:name/id/:id",(path,name,id)=>handler())
// regEx
*/