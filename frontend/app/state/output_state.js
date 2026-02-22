// frontend/app/state/output_state.js

/**
 * OutputState
 *
 * Dedicated manager for the current output text.
 * Keeps output logic isolated and clean.
 */

class OutputState {
  constructor() {
    this.value = "";
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    for (const fn of this.listeners) {
      fn(this.value);
    }
  }

  set(value) {
    this.value = typeof value === "string" ? value : "";
    this.notify();
  }

  clear() {
    this.value = "";
    this.notify();
  }

  get() {
    return this.value;
  }
}

export default OutputState;
