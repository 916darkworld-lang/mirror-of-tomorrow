// frontend/app/controllers/event_bus_controller.js

/**
 * EventBusController
 *
 * A lightweight pub/sub event bus for cross‑component communication.
 * This prevents components from directly referencing each other and
 * keeps the architecture clean and decoupled.
 *
 * Usage:
 *   bus.on("ai:loaded", fn)
 *   bus.emit("ai:loaded", { id: "claude" })
 */

class EventBusController {
  constructor() {
    this.listeners = {};
  }

  on(event, fn) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  }

  off(event, fn) {
    if (!this.listeners[event]) return;

    this.listeners[event] = this.listeners[event].filter((cb) => cb !== fn);
  }

  emit(event, payload) {
    if (!this.listeners[event]) return;

    for (const fn of this.listeners[event]) {
      try {
        fn(payload);
      } catch (err) {
        console.error("EventBusController listener error:", err);
      }
    }
  }

  clear(event) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }
}

export default EventBusController;
