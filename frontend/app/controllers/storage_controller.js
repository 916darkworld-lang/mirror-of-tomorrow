// frontend/app/controllers/storage_controller.js

/**
 * StorageController
 *
 * A thin wrapper around localStorage/sessionStorage with:
 *  - namespacing
 *  - JSON safety
 *  - future‑proofing for IndexedDB or file‑based storage
 *
 * This keeps storage logic consistent and centralized.
 */

class StorageController {
  constructor(config = {}) {
    /**
     * config = {
     *   namespace: "app",
     *   mode: "local" | "session"
     * }
     */

    this.namespace = config.namespace || "app";
    this.mode = config.mode === "session" ? "session" : "local";

    this.store =
      this.mode === "session" ? window.sessionStorage : window.localStorage;
  }

  _key(key) {
    return `${this.namespace}:${key}`;
  }

  set(key, value) {
    try {
      this.store.setItem(this._key(key), JSON.stringify(value));
    } catch (err) {
      console.error("StorageController: failed to set key", key, err);
    }
  }

  get(key) {
    try {
      const raw = this.store.getItem(this._key(key));
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error("StorageController: failed to get key", key, err);
      return null;
    }
  }

  remove(key) {
    try {
      this.store.removeItem(this._key(key));
    } catch (err) {
      console.error("StorageController: failed to remove key", key, err);
    }
  }

  clearNamespace() {
    try {
      const prefix = `${this.namespace}:`;
      for (let i = this.store.length - 1; i >= 0; i--) {
        const k = this.store.key(i);
        if (k && k.startsWith(prefix)) {
          this.store.removeItem(k);
        }
      }
    } catch (err) {
      console.error("StorageController: failed to clear namespace", err);
    }
  }
}

export default StorageController;
