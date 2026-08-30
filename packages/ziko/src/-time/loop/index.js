export class TimeLoop {
  constructor(callback, { step = 1000, t0 = 0, t1 = Infinity, autoplay = true } = {}) {
    this.callback = callback;
    this.cache = {
      isRunning: false,
      id: null,
      last_tick: null,
      step,
      t0,
      t1,
      autoplay,
      pauseTime: null,
      frame : 0,
    };

    if (autoplay) {
      t0 ? this.startAfter(t0) : this.start();
      if (t1 !== Infinity) this.stopAfter(t1);
    }
  }

  get frame(){
    return this.cache.frame;
  }
  get elapsed(){
    return this.cache.elapsed;
  }

  start() {
    if (!this.cache.isRunning) {
      this.cache.frame = 0;
      this.cache.isRunning = true;
      this.cache.last_tick = Date.now();
      this.animate();
    }
    return this;
  }

  pause() {
    if (this.cache.isRunning) {
      clearTimeout(this.cache.id);
      this.cache.isRunning = false;
      this.cache.pauseTime = Date.now();
    }
    return this;
  }

  resume() {
    if (!this.cache.isRunning) {
      this.cache.isRunning = true;
      if (this.cache.pauseTime) {
        // adjust start time so delta stays consistent
        const pausedDuration = Date.now() - this.cache.pauseTime;
        this.cache.last_tick += pausedDuration;
      }
      this.animate();
    }
    return this;
  }

  stop() {
    this.pause();
    this.cache.frame = 0;
    return this;
  }

  startAfter(t = 1000) {
    setTimeout(() => this.start(), t);
    return this;
  }

  stopAfter(t = 1000) {
    setTimeout(() => this.stop(), t);
    return this;
  }

  animate = () => {
    if (this.cache.isRunning) {
      const now = Date.now();
      const delta = now - this.cache.last_tick;

      if (delta >= this.cache.step) {
        this.cache.elapsed = now - (this.cache.t0 || 0);
        this.callback(this);
        this.cache.frame++;
        this.cache.last_tick = now - (delta % this.cache.step);
      }

      this.cache.id = setTimeout(this.animate, 0);
    }
  }
}

export const loop = (callback, options = {}) => new TimeLoop(callback, options);


// Helpers
// const useFps = (fps) => 1000 / fps;

// const _loop = loop( e => {
//   console.log("Frame:", e.frame, " Elapsed: ", e.elapsed);
// });

