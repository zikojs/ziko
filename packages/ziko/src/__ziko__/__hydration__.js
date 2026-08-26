export const __HYDRATION__ = {
    store : new Map(),
    index : 0,
    register: function(component){
        this.store.set(this.index++ , component)
    },
    reset(){
        this.index = 0;
        this.store.clear()
    }
    
}