// frontend/app/components/error_display.js

/**
 * ErrorDisplay
 *
 * Renders error messages from ErrorState.
 */

import appState from "../state/app_state";

class ErrorDisplay {
  constructor(selector) {
    this.el = document.querySelector(selector);

    if (!this.el) {
      console.error("ErrorDisplay: element not found:", selector);
      return;
    }

    // Subscribe to error updates
    appState.error.subscribe((err) => {
      this.render(err);
    });

    // Initial render
    this.render(appState.error.getSnapshot());
  }

  render(err) {
    if (!err || !err.message) {
      this.el.textContent = "";
      this.el.style.display = "none";
      return;
    }

    this.el.textContent = err.message;
    this.el.style.display = "block";
  }

  clear() {
    this.el.textContent = "";
    this.el.style.display = "none";
  }
}

export default ErrorDisplay;
