class Thread {
    #worker;
    #callbacks = new Map();
    #idCounter = 0;
    #terminated = false;
    #closeRequested = false;
    constructor() {
        const workerCode = `
            self.onmessage = async function (e) {
                const { id, funStr, args } = e.data;
                try {
                    const func = new Function(
                        "return (" + funStr + ")"
                    )();
                    const result = await func(...args);
                    self.postMessage({ id, result });
                } catch (error) {
                    self.postMessage({
                        id,
                        error: error instanceof Error
                            ? error.message
                            : String(error)
                    });
                }
            };
        `;
        const blob = new Blob([workerCode], { type: "text/javascript"});
        const url = URL.createObjectURL(blob);
        try {
            this.#worker = new Worker(url);
        } finally {
            URL.revokeObjectURL(url);
        }
        this.#worker.addEventListener("message", (event) => {
            const { id, result, error } = event.data;
            const entry = this.#callbacks.get(id);
            if (!entry) return;
            this.#callbacks.delete(id);
            try {
                entry.callback(result, error);
            } catch (callbackError) {
                console.error("Thread callback error:", callbackError);
            }
            // Close only after all pending calls have completed.
            if ( this.#closeRequested && this.#callbacks.size === 0 ) this.terminate();
        });

        this.#worker.addEventListener("error", (event) => {
            const message = event.message || "Worker execution failed";
            for (const { callback } of this.#callbacks.values()) {
                try {
                    callback(undefined, message);
                } catch (error) {
                    console.error("Thread callback error:", error);
                }
            }
            this.#callbacks.clear();
            this.terminate();
        });
        this.#worker.addEventListener("messageerror", () => {
            console.error("Failed to deserialize a worker message");
        });
    }

    call(func, callback, args = [], close = false) {
        if (this.#terminated || this.#closeRequested) throw new Error("Thread is closing or has been terminated");
        if (typeof func !== "function") throw new TypeError("func must be a function");
        if (typeof callback !== "function") throw new TypeError("callback must be a function");
        if (!Array.isArray(args)) throw new TypeError("args must be an array");
        const id = ++this.#idCounter;
        this.#callbacks.set(id, { callback });
        try {
            this.#worker.postMessage({
                id,
                funStr: func.toString(),
                args
            });
        } catch (error) {
            this.#callbacks.delete(id);
            throw error;
        }
        if (close) this.#closeRequested = true;
        return this;
    }

    terminate() {
        if (this.#terminated) return;
        this.#terminated = true;
        this.#worker.terminate();
        for (const { callback } of this.#callbacks.values()) {
            try {
                callback(undefined, "Thread terminated before the task completed");
            } catch (error) {
                console.error("Thread callback error:", error);
            }
        }
        this.#callbacks.clear();
    }
}

const useThread = (func, callback, args = [], close = true) =>
    new Thread().call(func, callback, args, close);

export { Thread, useThread };
