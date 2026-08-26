import { Tick } from "./tick.js";

class Clock extends Tick {
  constructor(tickMs = 1000 / 60) {
    super(tickMs, () => this._tick());
    this.elapsed = 0;
    this._lastTime = performance.now();
    this._callbacks = new Set();
  }

  _tick() {
    const now = performance.now();
    const delta = now - this._lastTime;
    this.elapsed += delta;
    this._lastTime = now;

    for (const cb of this._callbacks) {
      cb({ elapsed: this.elapsed, delta });
    }
  }

  onTick(cb) {
    this._callbacks.add(cb);
    return () => this._callbacks.delete(cb); 
  }

  reset() {
    this.elapsed = 0;
    this._lastTime = performance.now();
  }

  pause() {
    super.stop();
  }

  resume() {
    this._lastTime = performance.now();
    super.start();
  }
}

const clock = (tickMs) => new Clock(tickMs)
export{
  Clock,
  clock
}


/* 

    const clock = new Clock(200);

    clock.onTick(({ elapsed, delta }) => {
      console.log(`Elapsed: ${elapsed.toFixed(0)}ms, Delta: ${delta.toFixed(0)}ms`);
    });

    clock.start();

    setTimeout(() => clock.pause(), 1000);  
    setTimeout(() => clock.resume(), 2000); 

*/