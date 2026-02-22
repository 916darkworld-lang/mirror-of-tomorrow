// frontend/app/state/chamber_state.js

/**
 * ChamberState
 *
 * Tracks the internal state of the Chamber:
 *  - active: whether a chamber run is in progress
 *  - lastPrompt: last executed prompt
 *  - lastOutput: last chamber output
 */

class ChamberState {
  constructor() {
    this.active = false;
    this.lastPrompt = "";
    this.lastOutput = "";
    this.listeners = new Set();
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify() {
    for (const fn of this.listeners) {
      fn({
        active: this.active,
        lastPrompt: this.lastPrompt,
        lastOutput: this.lastOutput,
      });
    }
  }

  start(prompt) {
    this.active = true;
    this.lastPrompt = prompt;
    this.notify();
  }

  finish(output) {
    this.active = false;
    this.lastOutput = output;
    this.notify();
  }

  reset() {
    this.active = false;
    this.lastPrompt = "";
    this.lastOutput = "";
    this.notify();
  }

  getSnapshot() {
    return {
      active: this.active,
      lastPrompt: this.lastPrompt,
      lastOutput: this.lastOutput,
    };
  }
}

export default ChamberState;
