export class UINode {
    constructor(node){
        this.cache = {
            node
        }
        // return new Proxy(this, {
        //     get(target, prop, receiver) {
        //         if (typeof prop === 'string' && prop.startsWith('__on')) {
        //             const event = prop.slice(2).toLowerCase();
        //             return callback => console.log(event, callback);
        //         }

        //         return Reflect.get(target, prop, receiver);
        //     }
        // });
    }
    isUINode(){
        return true
    }
    get node(){
        return this.cache.node;
    } 
}