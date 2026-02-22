// frontend/app/controllers/prompt_controller.js

/**
 * PromptController
 *
 * Thin controller that wraps PromptState.
 * Exists so future prompt logic (templates, presets, memory injection,
 * auto-expansion, validation, etc.) has a clean home.
 */

import appState from "../state/app_state";

class PromptController {
  constructor() {
    // Logic-only controller — no DOM wiring here.
  }

  set(value) {
    if (typeof value !== "string") return;
    appState.prompt.set(value);
  }

  get() {
    return appState.prompt.get();
  }

  clear() {
    appState.prompt.clear();
  }

  subscribe(fn) {
    appState.prompt.subscribe(fn);
  }
}

export default PromptController;
