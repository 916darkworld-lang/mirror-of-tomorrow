// frontend/app/state/loading_state.js

/**
 * LoadingState
 *
 * Dedicated manager for tracking loading operations.
 * Keeps async-state logic isolated and clean.
 */

class LoadingState {
  constructor() {
    this.active = false;
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    for (const fn of this.listeners) {
      fn(this.active);
    }
  }

  start() {
    this.active = true;
    this.notify();
  }

  stop() {
    this.active = false;
    this.notify();
  }

  isLoading() {
    return this.active;
  }
}

export default LoadingState;
