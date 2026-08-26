import { useSessionStorage } from '../hooks/use-storage.js'
export var __State__ = {
    store : new Map(),
    index : 0,
    session_storage : null,
    register: function(state){
        // if(!import.meta?.env?.SSR && import.meta?.env?.DEV){
        //     if(!this.session) this.session_storage = useSessionStorage('ziko-state', {})
        //     const savedValue = this.session_storage.get(this.index)
        //     if(!savedValue) this.session_storage.add({[this.index] : state.value});
        //     else state.value = savedValue
        // }
        // this.store.set(this.index++, state)
    },
    update: function(index, value){
    //    if(!import.meta?.env?.SSR && import.meta?.env?.DEV){
    //         this.session_storage.add({[index] : value})
    //     } 
    },

}
