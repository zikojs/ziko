import { register_swipe_event } from '../custom-events-registry/swipe.js';
const CATEGORY = 'swipe';
export const SwipeListeners = {
    onSwipeLeft(callback){
        if(!this.exp.events?.[CATEGORY]) register_swipe_event(this.element);
        return this.on(
            'swipeleft', callback, 
            { category : CATEGORY, isCustom : true})
    },
    onSwipeRight(callback){
        if(!this.exp.events?.[CATEGORY]) register_swipe_event(this.element);
        return this.on(
            'swiperight', callback, 
            { category : CATEGORY, isCustom : true})
    },
    onSwipeUp(callback){
        if(!this.exp.events?.[CATEGORY]) register_swipe_event(this.element);
        return this.on(
            'swipeup', callback, 
            { category : CATEGORY, isCustom : true})
    },
    onSwipeDown(callback){
        if(!this.exp.events?.[CATEGORY]) register_swipe_event(this.element);
        return this.on(
            'swipedown', callback, 
            { category : CATEGORY, isCustom : true})
    },
}


