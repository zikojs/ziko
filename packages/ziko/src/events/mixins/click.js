import {register_click_away_event} from '../custom-events-registry/click-away.js';
import { isCustomEventRegistred } from './utils/index.js';
const CATEGORY = 'click';
export const ClickListeners = {
    onClick(callback){
        return this.on(
            'click', callback, 
            { category : CATEGORY })
    },
    onDblClick(callback){
        return this.on(
            'dblclick', callback, 
            { category : CATEGORY})
    },
    onClickAway(callback){
        if(!isCustomEventRegistred(this, CATEGORY, 'clickaway')) register_click_away_event(this.element);
        return this.on(
            'clickaway', callback, 
            { category : CATEGORY, isCustom : true})
    },
}


