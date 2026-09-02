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