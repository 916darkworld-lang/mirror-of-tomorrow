// frontend/app/state/error_state.js

/**
 * ErrorState
 *
 * Dedicated manager for error handling.
 * Keeps error logic isolated so UIState stays clean.
 */

class ErrorState {
  constructor() {
    this.message = null;
    this.code = null;
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    for (const fn of this.listeners) {
      fn({
        message: this.message,
        code: this.code,
      });
    }
  }

  setError(message, code = null) {
    this.message = message;
    this.code = code;
    this.notify();
  }

  clear() {
    this.message = null;
    this.code = null;
    this.notify();
  }

  getSnapshot() {
    return {
      message: this.message,
      code: this.code,
    };
  }
}

export default ErrorState;
