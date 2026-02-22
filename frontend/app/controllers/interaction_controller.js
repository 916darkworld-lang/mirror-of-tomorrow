// frontend/app/controllers/interaction_controller.js

/**
 * InteractionController
 *
 * Central coordinator for high‑level user interactions that span
 * multiple controllers:
 *
 *  - sending prompts
 *  - triggering next/mix/chamber flows
 *  - syncing focus + keyboard + UI reactions
 *  - delegating to AppController for actual logic
 *
 * This keeps AppController clean and prevents cross‑controller clutter.
 */

import appState from "../state/app_state";

class InteractionController {
  constructor(config) {
    /**
     * config = {
     *   appController: instance of AppController,
     *   focusController: instance of FocusController
     * }
     */

    this.app = config.appController;
    this.focus = config.focusController;

    if (!this.app) console.error("InteractionController: missing appController");
    if (!this.focus) console.error("InteractionController: missing focusController");
  }

  send() {
    const prompt = appState.prompt.get();
    this.app.handleSend(prompt);
    this.focus.focusPrompt();
  }

  next() {
    this.app.handleNext();
    this.focus.focusPrompt();
  }

  mix() {
    this.app.handleMix();
    this.focus.focusPrompt();
  }

  chamber() {
    this.app.handleChamber();
    this.focus.focusPrompt();
  }

  /**
   * Optional: central place for future interaction rules,
   * such as:
   *  - disabling controls during chamber mode
   *  - auto‑advancing steps
   *  - multi‑AI orchestration triggers
   */
  update() {
    // Reserved for future logic.
  }
}

export default InteractionController;
