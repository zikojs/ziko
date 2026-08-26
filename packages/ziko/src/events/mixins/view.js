import { register_view_event } from '../custom-events-registry/view.js';
const CATEGORY = 'view';
export const ViewListeners = {
    onEnterView(callback){
        if(!this.exp.events?.[CATEGORY]) register_view_event(this.element);
        return this.on(
            'enterview', callback, 
            { category : CATEGORY, isCustom : true})
    },
    onExitView(callback){
        if(!this.exp.events?.[CATEGORY]) register_view_event(this.element);
        return this.on(
            'exitview', callback, 
            { category : CATEGORY, isCustom : true})
    },
    onResizeView(callback){
        if(!this.exp.events?.[CATEGORY]) register_view_event(this.element);
        return this.on(
            'resizeview', callback, 
            { category : CATEGORY, isCustom : true})
    },
}


