// frontend/app/state/theme_state.js

/**
 * ThemeState
 *
 * Tracks the current UI theme (light, dark, or chamber mode).
 * Keeps theme logic isolated and clean.
 */

class ThemeState {
  constructor() {
    this.mode = "dark"; // default
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    for (const fn of this.listeners) {
      fn(this.mode);
    }
  }

  set(mode) {
    if (typeof mode !== "string") return;
    this.mode = mode;
    this.notify();
  }

  toggle() {
    this.mode = this.mode === "dark" ? "light" : "dark";
    this.notify();
  }

  get() {
    return this.mode;
  }
}

export default ThemeState;
