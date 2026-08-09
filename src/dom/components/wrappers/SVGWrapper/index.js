import { UIElement } from "../../../constructors/UIElement.js";

class UISVGWrapper extends UIElement {
    constructor(content){
        super({element : 'div', name : 'html_wrappper'})
        this.element.append(svg2dom(content));
        this.style({
            display : 'contents'
        })
    }
}

function svg2dom(svgString) {
  if (typeof DOMParser !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString.trim(), "image/svg+xml");
    const svg = doc.documentElement;

    if (svg.nodeName === "parsererror") {
      throw new Error("Invalid SVG string");
    }
    if(svg.hasAttribute('xmlns')) return svg
    // TO Fix ...
    const {children, attributes} = svg;
    const element = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    for(let {name, value} of attributes){
      element.setAttribute(name, value)
    }
    element.append(...children)

    globalThis.svg = svg
    globalThis.children = children 
    globalThis.attributes = attributes
    globalThis.element = element
    return element;
  }
  throw new Error("DOMParser is not available in this environment");
}



const SVGWrapper = (content) => new UISVGWrapper(content)
export{
    UISVGWrapper,
    SVGWrapper
}