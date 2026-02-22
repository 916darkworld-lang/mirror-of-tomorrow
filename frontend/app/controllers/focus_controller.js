// frontend/app/controllers/focus_controller.js

/**
 * FocusController
 *
 * Centralized handler for managing focus behavior across the app.
 * This prevents scattered focus logic and keeps keyboard flow clean.
 *
 * Responsibilities:
 *  - Focus the prompt input after actions
 *  - Optionally focus buttons or other UI elements
 *  - Provide a clean API for future focus rules
 */

class FocusController {
  constructor(config) {
    /**
     * config = {
     *   promptSelector: "#prompt",
     *   sendSelector: "#send",
     *   nextSelector: "#next",
     *   mixSelector: "#mix",
     *   chamberSelector: "#chamber"
     * }
     */

    this.promptEl = document.querySelector(config.promptSelector);
    this.sendEl = document.querySelector(config.sendSelector);
    this.nextEl = document.querySelector(config.nextSelector);
    this.mixEl = document.querySelector(config.mixSelector);
    this.chamberEl = document.querySelector(config.chamberSelector);

    this.validate();
  }

  validate() {
    if (!this.promptEl) console.error("FocusController: prompt element missing");
    if (!this.sendEl) console.error("FocusController: send element missing");
    if (!this.nextEl) console.error("FocusController: next element missing");
    if (!this.mixEl) console.error("FocusController: mix element missing");
    if (!this.chamberEl) console.error("FocusController: chamber element missing");
  }

  focusPrompt() {
    if (this.promptEl) this.promptEl.focus();
  }

  focusSend() {
    if (this.sendEl) this.sendEl.focus();
  }

  focusNext() {
    if (this.nextEl) this.nextEl.focus();
  }

  focusMix() {
    if (this.mixEl) this.mixEl.focus();
  }

  focusChamber() {
    if (this.chamberEl) this.chamberEl.focus();
  }

  /**
   * Generic focus method for future extensibility.
   */
  focus(selector) {
    const el = document.querySelector(selector);
    if (el) el.focus();
  }
}

export default FocusController;
