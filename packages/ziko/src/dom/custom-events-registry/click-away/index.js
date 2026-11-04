export class ClickAwayEvent extends Event {
  constructor(originalEvent, targetElement) {
    super('clickaway', { bubbles: true, cancelable: true });
    this.originalEvent = originalEvent;
    this.targetElement = targetElement;
  }
}

export function registerClickAwayEvent(element) {
  if(!globalThis.document) return;
  function handler(e) {
    if (!element.contains(e.target)) {
      const clickAwayEvent = new ClickAwayEvent(e, element);
      element.dispatchEvent(clickAwayEvent);
    }
  }
  globalThis.document.addEventListener('click', handler);
  return () => globalThis.document.removeEventListener('click', handler);
}
