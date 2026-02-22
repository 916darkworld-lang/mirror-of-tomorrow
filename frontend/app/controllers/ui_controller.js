// frontend/app/controllers/ui_controller.js

/**
 * UIController
 *
 * A lightweight coordinator for UI‑level behaviors that do not belong
 * to any single component or state slice.
 *
 * Examples:
 *  - auto‑scrolling the output panel
 *  - applying theme classes to <body>
 *  - reacting to loading state changes
 *  - reacting to error state changes
 *
 * This controller keeps the DOM‑level glue clean and centralized.
 */

import appState from "../state/app_state";

class UIController {
  constructor(config) {
    /**
     * config = {
     *   outputSelector: "#output",
     *   bodySelector: "body"
     * }
     */

    this.outputEl = document.querySelector(config.outputSelector);
    this.bodyEl = document.querySelector(config.bodySelector);

    if (!this.outputEl) {
      console.error("UIController: output element not found:", config.outputSelector);
    }

    if (!this.bodyEl) {
      console.error("UIController: body element not found:", config.bodySelector);
    }

    // Subscribe to theme changes
    appState.theme.subscribe((mode) => {
      this.applyTheme(mode);
    });

    // Subscribe to output changes for auto‑scroll
    appState.output.subscribe(() => {
      this.autoScrollOutput();
    });

    // Subscribe to errors for UI‑level reactions
    appState.error.subscribe((msg) => {
      this.handleError(msg);
    });
  }

  applyTheme(mode) {
    if (!this.bodyEl) return;

    this.bodyEl.classList.remove("light", "dark");
    this.bodyEl.classList.add(mode);
  }

  autoScrollOutput() {
    if (!this.outputEl) return;

    // Scroll to bottom after output updates
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  handleError(message) {
    if (!message) return;

    // Simple UI‑level error reaction for now.
    // You will replace this with a proper error panel later.
    console.warn("UI Error:", message);
  }
}

export default UIController;
