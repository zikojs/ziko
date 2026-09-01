export declare class Tick {
    ms: number;
    fn: (self: Tick) => void;
    count: number;
    frame: number;
    id: ReturnType<typeof setInterval> | null;
    running: boolean;

    constructor(
        fn: (self: Tick) => void,
        ms: number,
        count?: number,
        start?: boolean
    );

    start(): this;
    stop(): this;
    isRunning(): boolean;
}

export declare function tick(
    fn: (self: Tick) => void,
    ms: number,
    count?: number,
    start?: boolean
): Tick;
