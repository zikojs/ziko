import {UINode} from "../constructors/UINode.js";
class ZikoUIText extends UINode {
    constructor(...value) {
      super("span", "text", false, ...value);
      this.element = globalThis?.document?.createTextNode(...value)
    }
    isText(){
      return true
    }
}
const text = (...str) => new ZikoUIText(...str);
export{
  ZikoUIText,
  text
}