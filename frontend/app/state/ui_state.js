// frontend/app/state/ui_state.js

/**
 * UIState
 *
 * Centralized state manager for the Mirror of Tomorrow frontend.
 * Tracks:
 *  - current prompt
 *  - current output
 *  - loading state
 *  - error state
 *  - history
 */

class UIState {
  constructor() {
    this.prompt = "";
    this.output = "";
    this.loading = false;
    this.error = null;
    this.history = [];
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    for (const fn of this.listeners) {
      fn(this.getSnapshot());
    }
  }

  getSnapshot() {
    return {
      prompt: this.prompt,
      output: this.output,
      loading: this.loading,
      error: this.error,
      history: [...this.history],
    };
  }

  setPrompt(value) {
    this.prompt = value;
    this.notify();
  }

  setOutput(value) {
    this.output = value;
    this.history.push({ prompt: this.prompt, output: value });
    this.notify();
  }

  setLoading(value) {
    this.loading = value;
    this.notify();
  }

  setError(message) {
    this.error = message;
    this.notify();
  }

  clear() {
    this.prompt = "";
    this.output = "";
    this.error = null;
    this.notify();
  }
}

export default UIState;
