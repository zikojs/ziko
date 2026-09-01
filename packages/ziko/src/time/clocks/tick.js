class Tick {
  constructor(fn, ms, count = Infinity, start) {
    this.ms = ms;
    this.fn = fn;
    this.count = count;
    this.frame = 1;
    this.id = null;
    this.running = false;
    if(start) this.start()
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.frame = 1;
      this.id = setInterval(() => {
        if (this.frame > this.count) {
          this.stop();
          return;
        }
        this.fn.call(null, this);
        this.frame++;
      }, this.ms);
    }
    return this;
  }

  stop() {
    if (this.running) {
      this.running = false;
      clearInterval(this.id);
      this.id = null;
    }
    return this;
  }

  isRunning() {
    return this.running;
  }
}

// Helper factory
const tick = (fn, ms, count = Infinity, start = true) => new Tick(fn, ms, count, start);

export {
  Tick,
  tick
};
