class UseThread {
    #worker;
    #callbacks = new Map();
    #idCounter = 0;

    constructor() {
        const workerCode = `
            this.onmessage = function(e) {
                const { id, funStr, args, close } = e.data;
                try {
                    const func = new Function("return " + funStr)();
                    const result = func(...args);
                    postMessage({ id, result });
                } catch (error) {
                    postMessage({ id, error: error.message });
                } finally {
                    if (close) self.close();
                }
            }
        `;
        const blob = new Blob([workerCode], { type: "text/javascript" });
        this.#worker = new Worker(URL.createObjectURL(blob));

        this.#worker.addEventListener("message", (e) => {
            const { id, result, error } = e.data;
            const callback = this.#callbacks.get(id);
            if (!callback) return;

            callback(result, error);
            this.#callbacks.delete(id);
        });
    }
    call(func, callback, args = [], close = true) {
        if (typeof func !== "function") throw new TypeError("func must be a function");
        const id = ++this.#idCounter;
        this.#callbacks.set(id, callback);

        this.#worker.postMessage({
            id,
            funStr: func.toString(),
            args,
            close
        });

        return this;
    }

    terminate() {
        this.#worker.terminate();
    }
}

const useThread = (func, callback, args = [], close = true) => new UseThread().call(func, callback, args, close);

export { UseThread, useThread };
