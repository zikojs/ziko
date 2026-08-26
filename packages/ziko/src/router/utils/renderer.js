export const renderer = async (target, component, props, wrapper) =>{
    if(!component) return;
    let mounted = await component(props);
    if(wrapper) mounted = wrapper(mounted);
    mounted instanceof Array 
        ? mounted.forEach(el => el.mount(target)) 
        : mounted.mount(target);
}