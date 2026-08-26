export interface TimeTask {
    fn: () => Promise<any> | any;
    delay?: number;
}

export type ParallelTasks = TimeTask[];

export interface TimeSchedulerOptions {
    repeat?: number;
    loop?: boolean;
}

export declare class TimeScheduler {
    tasks: (TimeTask | ParallelTasks)[];
    repeat: number;
    loop: boolean;

    stopped: boolean;
    running: boolean;

    onStart: (() => void) | null;
    onTask: ((fn: () => Promise<any> | any) => void) | null;
    onEnd: (() => void) | null;

    constructor(
        tasks?: (TimeTask | ParallelTasks)[],
        options?: TimeSchedulerOptions
    );

    run(): Promise<void>;

    stop(): void;

    addTask(task: TimeTask | ParallelTasks): void;

    clearTasks(): void;
}

export declare function Scheduler(
    tasks?: (TimeTask | ParallelTasks)[],
    options?: { repeat?: number | null }
): TimeScheduler;
