import { Tick } from "./tick.js";

export interface ClockTickEvent {
    elapsed: number;
    delta: number;
}

export declare class Clock extends Tick {
    elapsed: number;
    protected _lastTime: number;
    protected _callbacks: Set<(ev: ClockTickEvent) => void>;

    constructor(tickMs?: number);

    protected _tick(): void;

    onTick(
        cb: (ev: ClockTickEvent) => void
    ): () => boolean;

    reset(): void;

    pause(): void;

    resume(): void;
}

export declare function clock(tickMs?: number): Clock;
