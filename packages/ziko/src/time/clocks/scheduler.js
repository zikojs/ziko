export class TimeScheduler {
  constructor(tasks = [], { repeat = 1, loop = false } = {}) {
    this.tasks = tasks;
    this.repeat = repeat;
    this.loop = loop;

    this.stopped = false;
    this.running = false;

    // lifecycle hooks
    this.onStart = null;
    this.onTask = null;
    this.onEnd = null;
  }

  async run() {
    if (this.running) return;
    this.running = true;
    this.stopped = false;

    if (this.onStart) this.onStart();

    let repeatCount = this.repeat;

    do {
      for (const task of this.tasks) {
        if (this.stopped) return;

        if (Array.isArray(task)) {
          // Parallel tasks
          await Promise.all(
            task.map(({ fn, delay = 0 }) =>
              new Promise(async (resolve) => {
                if (delay > 0) await new Promise(r => setTimeout(r, delay));
                if (this.onTask) this.onTask(fn);
                await fn();
                resolve();
              })
            )
          );
        } else {
          // Single task
          const { fn, delay = 0 } = task;
          if (delay > 0) await new Promise(r => setTimeout(r, delay));
          if (this.onTask) this.onTask(fn);
          await fn();
        }
      }
    } while (this.loop && !this.stopped && (repeatCount === Infinity || repeatCount-- > 1));

    if (!this.stopped && this.onEnd) this.onEnd();
    this.running = false;
  }

  stop() {
    this.stopped = true;
    this.running = false;
  }

  addTask(task) {
    this.tasks.push(task);
  }

  clearTasks() {
    this.tasks = [];
  }
}

export const Scheduler = (tasks, { repeat = null} = {}) => new TimeScheduler(tasks, { repeat})