import { linear } from "../ease/index.js";
import { map } from "../../math/functions/utils/index.js";

class TimeAnimation {
  constructor(callback, { ease = linear, step = 50, t0 = 0, start = true, duration = 3000 } = {}) {
    this.callback = callback;
    this.state = {
      isRunning: false,
      animationId: null,
      startTime: null,
      ease,
      step,
    //   interval: [t0, t1],
      autoStart: start,
      duration
    };

    this.t = 0;   // elapsed time
    this.tx = 0;  // normalized [0,1]
    this.ty = 0;  // eased value
    this.i = 0;   // frame index

    if (this.state.autoStart) {
      this.start();
    }
  }

  // ---- private loop handler ----
  #tick = () => {
    this.t += this.state.step;
    this.i++;

    this.tx = map(this.t, 0, this.state.duration, 0, 1);
    this.ty = this.state.ease(this.tx);

    this.callback(this);

    if (this.t >= this.state.duration) {
      clearInterval(this.state.animationId);
      this.state.isRunning = false;
    }
  };

  // ---- core runner ----
  #run(reset = true) {
    if (!this.state.isRunning) {
      if (reset) this.reset(false);

      this.state.isRunning = true;
      this.state.startTime = Date.now();
      this.state.animationId = setInterval(this.#tick, this.state.step);
    }
    return this;
  }

  // ---- lifecycle methods ----
  start() {
    return this.#run(true);
  }

  pause() {
    if (this.state.isRunning) {
      clearInterval(this.state.animationId);
      this.state.isRunning = false;
    }
    return this;
  }

  resume() {
    return this.#run(false);
  }

  stop() {
    this.pause();
    this.reset(false);
    return this;
  }

  reset(restart = true) {
    this.t = 0;
    this.tx = 0;
    this.ty = 0;
    this.i = 0;

    if (restart) this.start();
    return this;
  }
}

// Hook-style factory
const animation = (callback, {ease, t0, t1, start, duration} = {}) =>
  new TimeAnimation(callback, {ease, t0, t1, start, duration});

export { TimeAnimation, animation };
