import { UINode } from "../../mini-dom/UINode";

class UIComment extends UINode{
    constructor(text){
        super()
        this.element = document.createComment(text)
    }
}

export const Comment = (text) => new UIComment(text)