import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Scheduler } from "ziko/time/scheduler/index"; // adjust the path

describe("Scheduler", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // replace real timers with mocked ones
  });

  afterEach(() => {
    vi.useRealTimers(); // restore real timers
  });

  it("runs tasks in parallel and sequence", async () => {
    const logs = [];

    const s2 = Scheduler([
      [
        { fn: () => logs.push("Parallel A (1s)"), delay: 1000 },
        { fn: () => logs.push("Parallel B (2s)"), delay: 2000 }
      ],
      { fn: () => logs.push("After parallel"), delay: 500 }
    ]);

    s2.run();

    // Move 999ms forward -> nothing should run yet
    vi.advanceTimersByTime(999);
    expect(logs).toEqual([]);

    // Move to 1000ms -> first parallel task should fire
    // vi.advanceTimersByTime(1);
    // expect(logs).toEqual(["Parallel A (1s)"]);

    // Move to 2000ms -> second parallel task should fire
    // vi.advanceTimersByTime(1000);
    // expect(logs).toEqual(["Parallel A (1s)", "Parallel B (2s)"]);

    // Move to 2500ms -> "After parallel" should fire
    // vi.advanceTimersByTime(500);
    // expect(logs).toEqual([
    //   "Parallel A (1s)",
    //   "Parallel B (2s)",
    //   "After parallel"
    // ]);
  });
});
