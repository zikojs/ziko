import { UIElement } from "../../dom/constructors/UIElement.js";
import { 
  set_vertical,
  set_horizontal,
  map_pos_x,
  map_pos_y
} from './utils/index.js'
class UIFlex extends UIElement {
  constructor({tag = "div", orientation = "h", order, w = "100%", h = "100%"} = {}) {
    super({element : tag , name : "Flex"});
    this.direction = "cols";
    this.style({ display: "flex" });
    // this.mount();
  }
  isFlex(){
    return true;
  }
  responsify(respBreakPoint, wrap = true) {
    this.wrap(wrap);
    if (this.element.clientWidth < respBreakPoint) this.vertical();
    else this.horizontal();
    return this;
  }
  setSpaceAround() {
    this.style({ justifyContent: "space-around" });
    return this;
  }
  setSpaceBetween() {
    this.style({ justifyContent: "space-between" });
    return this;
  }
  setBaseline() {
    this.style({ alignItems: "baseline" });
    return this;
  }
  gap(g) {
    if (this.direction === "row") this.style({ columnGap: g });
    else if (this.direction === "column") this.style({ rowGap: g });
    return this;
  }
  wrap(value = "wrap") {
    const values = ["no-wrap", "wrap","wrap-reverse"];
    this.style({
      flexWrap: typeof value === "string" ? value : values[+value],
    });
    return this;
  }
  _justifyContent(align = "center") {
    this.style({ justifyContent: align });
    return this;
  }
  // verticalize
  vertical(x, y, order = 1) {
    set_vertical.call(this, order)
    this.style({
      alignItems: typeof(x)==="number"?map_pos_x.call(this,x):x,
      justifyContent: typeof(y)=="number"?map_pos_y.call(this,y):y
    });
    return this;
  }
  // horizontalize
  horizontal(x, y, order = 1) {
    set_horizontal.call(this, order)
    this.style({
      alignItems: typeof(y)=="number"?map_pos_y.call(this,y):y,
      justifyContent: typeof(x)==="number"?map_pos_x.call(this,x):x
    });
    return this;
  }
  show() {
    this.isHidden = false;
    this.style({ display: "flex" });
    return this;
  }
}

const Flex = (...UIElement) =>{
  let tag="div";
  if(typeof UIElement[0]==="string"){
    tag=UIElement[0];
    UIElement.pop();
  }
  return new UIFlex(tag).append(...UIElement);
}

export{
  Flex,
  UIFlex
}