export const getCoordinates = (ctx, normalized = false) =>{
    const rect = ctx.element.getBoundingClientRect();
    const e = ctx.event;
    let x = (e?.clientX - rect.left) | 0;
    let y = (e?.clientY - rect.top) | 0;

    if(normalized){
        const w = ctx.element.clientWidth;
        const h = ctx.element.clientHeight;
        x = +((x / w) * 2 - 1).toFixed(8);
        y = +((y / h) * -2 + 1).toFixed(8);
    }

    return {x, y};
}

export const isCustomEventRegistred = (ctx, category, event_name) => ctx.exp.events?.[category]?.cache?.customEvents?.has(event_name)