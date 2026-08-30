const waitForUIElm=(UIElement)=>{
    return new Promise(resolve => {
        if (UIElement.element) {
            return resolve(UIElement.element);
        }
  
        const observer = new MutationObserver(() => {
            if (UIElement.element) {
                resolve(UIElement.element);
                observer.disconnect();
            }
        });
  
        observer.observe(document?.body, {
            childList: true,
            subtree: true
        });
    });
  }
  const waitForUIElmSync=(UIElement,timeout=2000)=>{
    const t0=Date.now();
    while(Date.now()-t0<timeout){
      if(UIElement.element)return UIElement.element
    }
  }
  export {waitForUIElm,waitForUIElmSync}