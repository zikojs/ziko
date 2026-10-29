
/**
 * Callback invoked when an IPC event is received.
 */
export type IPCHandler<T = unknown> = (payload: T) => void;

/**
 * Room name or multiple room names.
 */
export type IPCRooms = string | string[];

/**
 * Fluent room-targeting operator.
 *
 * Supports chaining multiple room targets before emitting.
 */
export interface IPCBroadcastOperator {
    /**
     * Add one or more rooms to the target set.
     *
     * @example
     * ipc.to("chat")
     *    .to(["admin", "moderators"])
     *    .emit("notification", { message: "Hello!" });
     */
    to(rooms: IPCRooms): IPCBroadcastOperator;

    /**
     * Emit an event to the selected rooms.
     *
     * A receiver joined to any selected room can receive the message.
     */
    emit<T = unknown>(event: string, payload: T): IPCBroadcastOperator;
}

/**
 * Cross-context messaging using the BroadcastChannel API.
 *
 * Instances with the same channel name communicate with one another.
 *
 * @example
 * const ipc = useIPC("ziko-app");
 *
 * ipc.on("message", (data) => {
 *     console.log(data);
 * });
 *
 * ipc.emit("message", { text: "Hello!" });
 */
export declare class IPC {
    /**
     * Create an IPC channel.
     *
     * @param name Channel name. Defaults to an empty string.
     */
    constructor(name?: string);

    /**
     * Target one or more rooms for the next emission.
     *
     * @example
     * ipc.to("chat").emit("message", { text: "Hello room!" });
     *
     * @example
     * ipc.to(["chat", "admin"]).emit("notification", {
     *     message: "Important update"
     * });
     */
    to(rooms: IPCRooms): IPCBroadcastOperator;

    /**
     * Create an IPC instance for a separate namespace.
     *
     * Each namespace uses a separate BroadcastChannel.
     *
     * @param namespace Namespace name.
     *
     * @example
     * const chat = ipc.of("chat");
     * chat.emit("message", "Hello from chat");
     */
    of(namespace: string): IPC;

    /**
     * Emit an event to all listening instances on this channel,
     * regardless of their joined rooms.
     *
     * @example
     * ipc.emit("notification", { message: "Hello everyone" });
     */
    emit<T = unknown>(event: string, payload: T): this;

    /**
     * Register an event handler.
     *
     * @param event Event name.
     * @param handler Function called with the received payload.
     * @param rooms Optional room filter for this handler.
     *
     * @example
     * ipc.on("message", (data: { text: string }) => {
     *     console.log(data.text);
     * });
     *
     * @example
     * ipc.on("message", console.log, ["chat", "admin"]);
     */
    on<T = unknown>(
        event: string,
        handler: IPCHandler<T>,
        rooms?: IPCRooms
    ): this;

    /**
     * Register a handler that runs at most once.
     *
     * @example
     * ipc.once("ready", () => {
     *     console.log("Ready!");
     * });
     */
    once<T = unknown>(
        event: string,
        handler: IPCHandler<T>,
        rooms?: IPCRooms
    ): this;

    /**
     * Remove a registered event handler.
     *
     * Supports removing the original handler registered through once().
     *
     * @example
     * const handler = (data: unknown) => console.log(data);
     *
     * ipc.on("message", handler);
     * ipc.off("message", handler);
     */
    off(event: string, handler: IPCHandler): this;

    /**
     * Join one or more rooms.
     *
     * @example
     * ipc.join("chat", "admin");
     * ipc.join("moderators", "support");
     */
    join(...rooms: IPCRooms[]): this;

    /**
     * Leave selected rooms, or all rooms if no arguments are provided.
     *
     * @example
     * ipc.leave("chat");
     * ipc.leave("admin", "moderators");
     * ipc.leave();
     */
    leave(...rooms: IPCRooms[]): this;

    /**
     * Close the underlying BroadcastChannel and clear local handlers.
     *
     * @example
     * ipc.close();
     */
    close(): this;
}

/**
 * Create an IPC instance.
 *
 * @param name Channel name. Defaults to an empty string.
 * @returns A new IPC instance.
 *
 * @example
 * const ipc = useIPC("ziko-app");
 *
 * ipc.join("chat");
 * ipc.on("message", console.log);
 * ipc.to("chat").emit("message", { text: "Hello!" });
 *
 * ipc.close();
 */
export declare function useIPC(name?: string): IPC;
