class SwipeEvent extends CustomEvent {
  constructor(type, detail) {
    super(type, {
      detail,
      bubbles: true,
      cancelable: true
    });
  }
}

function register_swipe_event(
  element,
  threshold = 5,
  restraint = 100,
  allowedTime = 500
) {
  let startX = 0,
      startY = 0,
      startTime = 0,
      isPointerDown = false;

  function onPointerDown(e) {
    startX = e.clientX;
    startY = e.clientY;
    startTime = performance.now();
    isPointerDown = true;
  }

  function onPointerUp(e) {
    if (!isPointerDown) return;
    isPointerDown = false;

    const distX = e.clientX - startX;
    const distY = e.clientY - startY;
    const elapsed = performance.now() - startTime;

    let direction = null;
    let eventName = null;

    if (elapsed <= allowedTime) {
      if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) {
        direction = distX < 0 ? "left" : "right";
        eventName = "swipe" + direction;
      } 
      else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
        direction = distY < 0 ? "up" : "down";
        eventName = "swipe" + direction;
      }
    }

    // Emit event
    if (eventName) {
      element.dispatchEvent(
        new SwipeEvent(eventName, {
          direction,
          distX,
          distY,
          originalEvent: e
        })
      );
    }
  }

  element.addEventListener("pointerdown", onPointerDown, { passive: true });
  element.addEventListener("pointerup", onPointerUp, { passive: true });

  return () => {
    element.removeEventListener("pointerdown", onPointerDown);
    element.removeEventListener("pointerup", onPointerUp);
  };
}

export {
  SwipeEvent,
  register_swipe_event
};
