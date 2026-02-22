// frontend/app/controllers/chamber_controller.js

/**
 * ChamberController
 *
 * Dedicated controller for chamber-mode logic.
 * AppController triggers chamber mode, but this file contains
 * the deeper orchestration logic for multi-step chamber processing.
 *
 * NOTE:
 * This is a clean, minimal baseline. You will expand this later
 * when chamber mode becomes multi-phase, multi-AI, or recursive.
 */

import appState from "../state/app_state";

class ChamberController {
  constructor() {
    this.active = false;
    this.currentPrompt = null;
  }

  start(prompt) {
    if (!prompt) return;

    this.active = true;
    this.currentPrompt = prompt;

    appState.chamber.start(prompt);

    // Placeholder for future multi-step chamber logic.
    // For now, we simulate a delayed result.
    setTimeout(() => {
      const result = `Chamber processed: ${prompt}`;
      this.finish(result);
    }, 400);
  }

  finish(output) {
    this.active = false;

    appState.chamber.finish(output);
    appState.output.set(output);
    appState.history.add("(chamber)", output);
  }

  isActive() {
    return this.active;
  }
}

export default ChamberController;
