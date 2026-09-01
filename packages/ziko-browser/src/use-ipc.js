class UseIPC {
    #channel;
    #eventData;
    #handlers;
    #uuid;
    #subscribers;
    #currentRooms;
    constructor(name = "") {
        this.#channel = new BroadcastChannel(name);
        this.#eventData = new Map();
        this.#handlers = new Map(); // Map<event, Array<{fn, rooms}>>
        this.#uuid = "ziko-channel:" + (Math.random()*10e16);  // To Be Replaced by UUID
        this.#subscribers = new Set([this.#uuid]);
        this.#currentRooms = new Set(); 
        this.#channel.addEventListener("message", (e) => {
            const { last_sent_event, userId, eventData, rooms } = e.data;
            if (userId === this.#uuid) return; // ignore own messages
            // broadcast if no rooms, else check intersection
            if (rooms && rooms.length && !rooms.some(r => this.#currentRooms.has(r))) return;
            this.#subscribers.add(userId);
            this.#eventData = new Map(eventData);
            const handlersList = this.#handlers.get(last_sent_event);
            if (!handlersList) return;
            handlersList.forEach(({ fn, rooms: handlerRooms }) => {
                // trigger if listener has no room filter, or intersects subscriber rooms
                if (!handlerRooms || handlerRooms.length === 0 ||
                    !rooms || rooms.some(r => handlerRooms.includes(r))) {
                    fn(this.#eventData.get(last_sent_event));
                }
            });
        });
    }

    emit(event, data, rooms) {
        this.#eventData.set(event, data);
        if(typeof rooms === 'string') rooms = [rooms]
        this.#channel.postMessage({
            eventData: Array.from(this.#eventData.entries()),
            last_sent_event: event,
            userId: this.#uuid,
            rooms: rooms && rooms.length ? rooms : undefined
        });
        return this;
    }
    on(event, handler = console.log, rooms) {
        if (!this.#handlers.has(event)) this.#handlers.set(event, []);
        if(typeof rooms === 'string') rooms = [rooms]
        this.#handlers.get(event).push({ fn: handler, rooms });
        return this;
    }
    off(event, handler) {
        if (!this.#handlers.has(event)) return this;
        this.#handlers.set(
            event,
            this.#handlers.get(event).filter(h => h.fn !== handler)
        );
        return this;
    }
    once(event, handler, rooms) {
        const wrapper = (data) => {
            handler(data);
            this.off(event, wrapper);
        };
        this.on(event, wrapper, rooms);
        return this;
    }
    join(...rooms) {
        rooms.forEach(r => this.#currentRooms.add(r));
        return this;
    }
    leave(...rooms) {
        if (!rooms.length) this.#currentRooms.clear();
        else rooms.forEach(r => this.#currentRooms.delete(r));
        return this;
    }
    close() {
        this.#channel.close();
        return this;
    }
}

const useIPC = (name) => new UseIPC(name);
export { useIPC };
