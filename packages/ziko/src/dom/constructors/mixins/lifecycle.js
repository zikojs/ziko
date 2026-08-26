// export function mount(target = this.target) {
//   if(this.isBody) return ;
//   if(target?.isUIElement)target=target.element;
//   this.target=target;
//   this.target?.appendChild(this.element);
//   return this;
// }
// export function unmount(){
//   if(this.cache.parent)this.cache.parent.remove(this);
//   else if(this.target?.children?.length && [...this.target?.children].includes(this.element)) this.target.removeChild(this.element);
//   return this;
// }

// export function mountAfter(target = this.target, t = 1) {
//   setTimeout(() => this.mount(), t);
//   return this;
// }
// export function unmountAfter(t = 1) {
//   setTimeout(() => this.unmount(), t);
//   return this;
// }

export function mount(target = this.target, delay = 0) {
    if (delay > 0) {
        setTimeout(() => this.mount(target, 0), delay);
        return this;
    }

    if (this.isBody) return this;

    if (target?.isUIElement) target = target.element;
    this.target = target;

    this.target?.appendChild(this.element);
    return this;
}

export function unmount(delay = 0) {
    if (delay > 0) {
        setTimeout(() => this.unmount(0), delay);
        return this;
    }

    if (this.cache.parent) {
        this.cache.parent.remove(this);
    } else if (
        this.target?.children?.length &&
        [...this.target.children].includes(this.element)
    ) {
        this.target.removeChild(this.element);
    }

    return this;
}
