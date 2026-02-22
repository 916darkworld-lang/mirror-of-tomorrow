// frontend/app/state/prompt_state.js

/**
 * PromptState
 *
 * Dedicated manager for the current prompt text.
 * Keeps prompt logic isolated and clean.
 */

class PromptState {
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

export default PromptState;
