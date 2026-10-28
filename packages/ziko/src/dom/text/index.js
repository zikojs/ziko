import {UINode} from "../UINode/index.js";
class UIText extends UINode {
    constructor(...value) {
      super("span", "text", false, ...value);
      this.element = globalThis?.document?.createTextNode(...value)
    }
    isText(){
      return true
    }
}
const text = (...str) => new UIText(...str);
export{
  UIText,
  text
}