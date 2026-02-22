// frontend/app/controllers/state_controller.js

/**
 * StateController
 *
 * A unified wrapper around all AppState modules.
 * This gives you a single import point if you ever want
 * to manipulate multiple state slices together.
 *
 * It does NOT replace the individual controllers — it simply
 * provides a consolidated interface when needed.
 */

import appState from "../state/app_state";

class StateController {
  constructor() {
    this.state = appState;
  }

  // ----- Prompt -----
  setPrompt(value) {
    if (typeof value !== "string") return;
    this.state.prompt.set(value);
  }

  getPrompt() {
    return this.state.prompt.get();
  }

  clearPrompt() {
    this.state.prompt.clear();
  }

  // ----- Output -----
  setOutput(value) {
    if (typeof value !== "string") return;
    this.state.output.set(value);
  }

  getOutput() {
    return this.state.output.get();
  }

  clearOutput() {
    this.state.output.clear();
  }

  // ----- Loading -----
  startLoading() {
    this.state.loading.start();
  }

  stopLoading() {
    this.state.loading.stop();
  }

  isLoading() {
    return this.state.loading.isLoading();
  }

  // ----- Error -----
  setError(message) {
    if (!message) return;
    this.state.error.set(message);
  }

  clearError() {
    this.state.error.clear();
  }

  getError() {
    return this.state.error.get();
  }

  // ----- History -----
  addHistory(prompt, output) {
    this.state.history.add(prompt, output);
  }

  clearHistory() {
    this.state.history.clear();
  }

  getHistory() {
    return this.state.history.getAll();
  }

  // ----- Theme -----
  toggleTheme() {
    this.state.theme.toggle();
  }

  setTheme(mode) {
    if (mode !== "light" && mode !== "dark") return;
    this.state.theme.set(mode);
  }

  getTheme() {
    return this.state.theme.get();
  }

  // ----- Chamber -----
  startChamber(prompt) {
    this.state.chamber.start(prompt);
  }

  finishChamber(output) {
    this.state.chamber.finish(output);
  }

  isChamberActive() {
    return this.state.chamber.isActive();
  }
}

export default StateController;
