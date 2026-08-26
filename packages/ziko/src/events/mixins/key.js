const CATEGORY = 'key'
export const KeyListeners = {
    onKeyDown(callback){
        return this.on(
            'keydown', callback, 
            { category : CATEGORY, details_setter : ctx=> { ctx.kd = ctx.event.key }
        })
    },
    onKeyPress(callback){
        return this.on(
            'keypress', callback, 
            { category : CATEGORY, details_setter : ctx=> { ctx.kp = ctx.event.key }
        })
    },
    onKeyUp(callback){
        return this.on(
            'keydown', callback, 
            { category : CATEGORY, details_setter : ctx=> { ctx.ku = ctx.event.key }
        })
    },
    
}


