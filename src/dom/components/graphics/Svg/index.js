import {UIElement}  from "../../../constructors/UIElement.js";
class UISvg extends UIElement {
    constructor(w=360,h=300) {
      super("svg","svg");
      //this.cache={};
      // this.setAttr("width",w);
      // this.setAttr("height",h);
      // this.setAttr({
      //   width : w,
      //   height : h
      // })
      this.style({border:"1px black solid"});
      //this.view(-w/2,-h/2,w/2,h/2);
      this.size(w, h)
      this.view(-10,-10,10,10);
    }
    size(w, h){
      this.setAttr({
        width : w,
        height : h
      });
      return this
    }
    view(x1,y1,x2,y2){
      let width=Math.abs(x2-x1);
      let height=Math.abs(y2-y1);
      this.setAttr("viewBox",[x1,y1,width,height].join(" "));
      this.st.scaleY(-1);
      return this;
    }
    add(...svgElement){
      for(let i=0;i<svgElement.length;i++){
        this.element.append(svgElement[i].element);
        this.items.push(svgElement[i])
      }
      this.maintain()
      return this;
    }
    remove(...svgElement){
      for(let i=0;i<svgElement.length;i++){
        this.element?.removeChild(svgElement[i].element);
        this.items=this.items.filter(n=>!svgElement)
      }
      this.maintain();
      return this;     
    }
    mask(){
  
    }
    toString(){
      return  (new XMLSerializer()).serializeToString(this.element);
    }
    btoa(){
      return btoa(this.toString())
    }
    toImg(){
      return 'data:image/svg+xml;base64,'+this.btoa()
    }
    toImg2(){
      return "data:image/svg+xml;charset=utf8,"+this.toString().replaceAll("<","%3C").replaceAll(">","%3E").replaceAll("#","%23").replaceAll('"',"'");
    }
    
  }

  const Svg =(w,h)=>new UISvg(w,h);
  export{
    Svg,
    UISvg,
}