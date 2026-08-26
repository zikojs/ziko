import {UIElement} from "../constructors/UIElement.js"
class ZikoUIGrid extends UIElement {
    constructor(tag ="div", w = "50vw", h = "50vh") {
      super({element : tag, name : "Grid"});
      this.direction = "cols";
      if (typeof w == "number") w += "%";
      if (typeof h == "number") h += "%";
      this.style({ border: "1px solid black", width: w, height: h });
      this.style({ display: "grid" });
    //   this.mount();
    }
    get isGird(){
        return true;
      }
    columns(n) {
        let temp = "";
        for (let i = 0; i < n; i++) temp = temp.concat(" auto");
        this.#templateColumns(temp);
        return this;
    }
    #templateColumns(temp = "auto auto") {
        this.style({ gridTemplateColumns: temp });
        return this;
    }
    gap(w = 10, h = w) {
        if(typeof (w) === "number")w += "px";
        if(typeof (h) === "number")h += "px";
        this.style({gridColumnGap: w,gridRowGap: h});
        return this;
    }
}
const Grid = (...UIElement) => new ZikoUIGrid("div").append(...UIElement);
export {Grid,ZikoUIGrid};