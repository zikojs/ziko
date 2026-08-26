export declare class TimeLoop {
    callback: (self: TimeLoop) => void;

    protected cache: {
        isRunning: boolean;
        id: ReturnType<typeof setTimeout> | null;
        last_tick: number | null;
        step: number;
        t0: number;
        t1: number;
        autoplay: boolean;
        pauseTime: number | null;
        frame: number;
        elapsed?: number;
    };

    constructor(
        callback: (self: TimeLoop) => void,
        options?: {
            step?: number;
            t0?: number;
            t1?: number;
            autoplay?: boolean;
        }
    );

    get frame(): number;

    get elapsed(): number | undefined;

    start(): this;
    pause(): this;
    resume(): this;
    stop(): this;

    startAfter(t?: number): this;
    stopAfter(t?: number): this;

    protected animate: () => void;
}

export declare function loop(
    callback: (self: TimeLoop) => void,
    options?: {
        step?: number;
        t0?: number;
        t1?: number;
        autoplay?: boolean;
    }
): TimeLoop;
