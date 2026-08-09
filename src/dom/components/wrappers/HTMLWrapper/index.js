import { UIElement } from "../../../constructors/UIElement.js";

class UIHTMLWrapper extends UIElement {
    constructor(content){
        super({element : 'div', name : 'html_wrappper'})
        this.element.append(html2dom(content))
        this.style({
            display : 'contents'
        })
    }
}

function html2dom(htmlString) {
    if(globalThis?.DOMParser){
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');
        doc.body.firstChild.style.display = "contents"
        return doc.body.firstChild;
    }
}

const HTMLWrapper = (content) => new UIHTMLWrapper(content)
export{
    UIHTMLWrapper,
    HTMLWrapper
}