// frontend/app/components/output_view.js

/**
 * OutputView
 *
 * Renders the current output text and updates when OutputState changes.
 */

import appState from "../state/app_state";

class OutputView {
  constructor(selector) {
    this.el = document.querySelector(selector);

    if (!this.el) {
      console.error("OutputView: element not found:", selector);
      return;
    }

    // Subscribe to output changes
    appState.output.subscribe((value) => {
      this.render(value);
    });

    // Initial render
    this.render(appState.output.get());
  }

  render(text) {
    this.el.textContent = text || "";
  }

  clear() {
    this.render("");
  }
}

export default OutputView;
