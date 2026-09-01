import { useIPC } from "./use-ipc.js";

class UseStorage {
  static RESERVED_KEYS = new Set([
    "cache", "items", "set", "add", "remove", "get", "clear", "onStorageUpdated"
  ]);

  constructor(storage, globalKey, initialValue, use_channel = true) {
    this.cache = {
      storage,
      globalKey,
      channel: use_channel ? useIPC(`Ziko:useStorage-${globalKey}`) : null,
      oldItemKeys: new Set()
    };

    this.#init(initialValue, use_channel);
  }

  get items() {
    const raw = this.cache.storage.getItem(this.cache.globalKey);
    if (!raw) return {};
    try {
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  #maintain() {
    const currentItems = this.items;
    const currentKeys = new Set(Object.keys(currentItems));

    // Cleanup keys that were removed
    this.cache.oldItemKeys.forEach(key => {
      if (!currentKeys.has(key)) {
        delete this[key];
        this.cache.oldItemKeys.delete(key);
      }
    });

    // Populate keys from storage onto `this`
    for (const key in currentItems) {
      if (!UseStorage.RESERVED_KEYS.has(key)) {
        this[key] = currentItems[key];
        this.cache.oldItemKeys.add(key);
      }
    }
  }

  #init(initialValue, use_channel) {
    if (use_channel && this.cache.channel) {
      this.cache.channel.on("Ziko-Storage-Updated", () => this.#maintain());
    }

    const hasStoredData = this.cache.storage.getItem(this.cache.globalKey) !== null;

    if (hasStoredData) {
      // Key already exists in storage -> Restore data to instance
      this.#maintain();
    } else if (initialValue !== undefined) {
      // Key doesn't exist -> Seed with initialValue
      this.set(initialValue);
    } else {
      // Key doesn't exist and no initialValue provided -> Default to empty
      this.#maintain();
    }
  }

  set(data) {
    this.cache.storage.setItem(this.cache.globalKey, JSON.stringify(data));
    if (this.cache.channel) {
      this.cache.channel.emit("Ziko-Storage-Updated", data);
    }
    this.#maintain();
    return this;
  }

  add(data) {
    return this.set({
      ...this.items,
      ...data
    });
  }

  remove(...keys) {
    const items = { ...this.items };
    keys.forEach(key => delete items[key]);
    return this.set(items);
  }

  get(key) {
    return this.items[key];
  }

  clear() {
    this.cache.storage.removeItem(this.cache.globalKey);
    this.#maintain();
    return this;
  }

  onStorageUpdated(callback) {
    if (this.cache.channel) {
      this.cache.channel.on("Ziko-Storage-Updated", callback);
    }
    return this;
  }
}

const useLocalStorage = (key, initialValue, use_channel = true) =>
  new UseStorage(localStorage, key, initialValue, use_channel);

const useSessionStorage = (key, initialValue, use_channel = true) =>
  new UseStorage(sessionStorage, key, initialValue, use_channel);

export {
  useLocalStorage,
  useSessionStorage
};