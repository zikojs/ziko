export class UINode {
    constructor(node){
        this.cache = {
            node
        }
    }
    isUINode(){
        return true
    }
    get node(){
        return this.cache.node;
    } 
}

// globalThis.node = (node) => new UINode(node);