import { getCoordinates } from "./utils/index.js";
const CATEGORY = 'ptr';
export const PtrListeners = {
    onPtrDown(callback, useNormalizedCoordinates = false){
        return this.on(
            'pointerdown', callback, 
            { category : CATEGORY, details_setter : (ctx)=> {
                const {x, y} = getCoordinates(ctx, useNormalizedCoordinates);
                ctx.dx = x;
                ctx.dy = y;
                ctx.isDown = true;
                ctx.isDragging = ctx.isMoving ?? false
            }}
        )
    },
    onPtrMove(callback, useNormalizedCoordinates = false){
        return this.on(
            'pointermove', callback, 
            { category : CATEGORY, details_setter : (ctx)=> {
                const {x, y} = getCoordinates(ctx, useNormalizedCoordinates);
                ctx.mx = x;
                ctx.my = y;
                ctx.isMoving = true;
                ctx.isDragging = ctx.isDown ?? false
            }}
        )
    },
    onPtrUp(callback, useNormalizedCoordinates = false){
        return this.on(
            'pointerup', callback, 
            { category : CATEGORY, details_setter : (ctx)=> {
                const {x, y} = getCoordinates(ctx, useNormalizedCoordinates);
                ctx.ux = x;
                ctx.uy = y;
                ctx.isDown = false;
                ctx.isMoving = false;
                ctx.isDragging = false;
            }}
        )
    }
}



