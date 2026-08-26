/**
 * Easing function used by animations.
 *
 * @param t - Normalized animation progress value between 0 and 1.
 * @returns The transformed progress value.
 */
export type EasingFunction = (t: number) => number;

/**
 * Configuration options for a TimeAnimation instance.
 */
export interface TimeAnimationOptions {
    /**
     * Easing function applied to the normalized progress.
     *
     * @default linear
     */
    ease?: EasingFunction;

    /**
     * Interval step between animation updates in milliseconds.
     *
     * @default 50
     */
    step?: number;

    /**
     * Initial time offset.
     *
     * @default 0
     */
    t0?: number;

    /**
     * Automatically start the animation after creation.
     *
     * @default true
     */
    start?: boolean;

    /**
     * Animation duration in milliseconds.
     *
     * @default 3000
     */
    duration?: number;
}

/**
 * Runtime state of a TimeAnimation instance.
 */
export interface TimeAnimationState {
    /**
     * Whether the animation is currently running.
     */
    isRunning: boolean;

    /**
     * Internal interval identifier.
     */
    animationId: ReturnType<typeof setInterval> | null;

    /**
     * Timestamp when the animation started.
     */
    startTime: number | null;

    /**
     * Current easing function.
     */
    ease: EasingFunction;

    /**
     * Interval step duration.
     */
    step: number;

    /**
     * Whether the animation starts automatically.
     */
    autoStart: boolean;

    /**
     * Total animation duration.
     */
    duration: number;
}

/**
 * Callback executed on every animation tick.
 *
 * @param animation - Current animation instance.
 */
export type AnimationCallback = (animation: TimeAnimation) => void;

/**
 * Time-based animation controller.
 *
 * Provides start, pause, resume, stop and reset lifecycle methods.
 * The callback receives the animation instance containing the current
 * elapsed time and progress values.
 */
export declare class TimeAnimation {
    /**
     * Creates a new time animation.
     *
     * @param callback - Function called on each animation step.
     * @param options - Animation configuration.
     */
    constructor(
        callback: AnimationCallback,
        options?: TimeAnimationOptions
    );

    /**
     * Animation state.
     */
    state: TimeAnimationState;

    /**
     * Elapsed animation time in milliseconds.
     */
    t: number;

    /**
     * Normalized progress value between 0 and 1.
     */
    tx: number;

    /**
     * Eased progress value.
     */
    ty: number;

    /**
     * Current animation step index.
     */
    i: number;

    /**
     * Starts or restarts the animation.
     *
     * @returns The current animation instance.
     */
    start(): this;

    /**
     * Pauses the animation.
     *
     * @returns The current animation instance.
     */
    pause(): this;

    /**
     * Resumes a paused animation.
     *
     * @returns The current animation instance.
     */
    resume(): this;

    /**
     * Stops the animation and resets its progress.
     *
     * @returns The current animation instance.
     */
    stop(): this;

    /**
     * Resets animation progress.
     *
     * @param restart - Whether to restart automatically after reset.
     *
     * @returns The current animation instance.
     */
    reset(restart?: boolean): this;
}

/**
 * Creates a time-based animation instance.
 *
 * @param callback - Function executed on every animation tick.
 * @param options - Animation configuration.
 *
 * @returns A new TimeAnimation instance.
 */
export declare const animation: (
    callback: AnimationCallback,
    options?: TimeAnimationOptions
) => TimeAnimation;
