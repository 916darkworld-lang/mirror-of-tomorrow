// frontend/app/state/history_state.js

/**
 * HistoryState
 *
 * Dedicated manager for prompt/output history.
 * Keeps the history logic separate from UIState so it can scale cleanly.
 */

class HistoryState {
  constructor() {
    this.items = [];
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    for (const fn of this.listeners) {
      fn([...this.items]);
    }
  }

  add(prompt, output) {
    this.items.push({
      prompt,
      output,
      timestamp: Date.now(),
    });
    this.notify();
  }

  clear() {
    this.items = [];
    this.notify();
  }

  getAll() {
    return [...this.items];
  }
}

export default HistoryState;
