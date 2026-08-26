class ClickAwayEvent extends Event {
  constructor(originalEvent, targetElement) {
    super("clickaway", { bubbles: true, cancelable: true });
    this.originalEvent = originalEvent;
    this.targetElement = targetElement;
  }
}

function register_click_away_event(element) {
  // console.log(element)
  function handler(e) {
    if (!element.contains(e.target)) {
      const clickAwayEvent = new ClickAwayEvent(e, element);
      element.dispatchEvent(clickAwayEvent);
    }
  }

  globalThis?.document?.addEventListener("click", handler);

  return () => globalThis?.document?.removeEventListener("click", handler);
  
}

export{
    ClickAwayEvent,
    register_click_away_event
}

// // Example usage
// const box = document.querySelector("#my-box");

// const stop = listenClickAway(box);

// box.addEventListener("clickaway", (e) => {
//   console.log("Clicked outside box!", e);
// });

// // later, you can stop listening:
// // stop();
