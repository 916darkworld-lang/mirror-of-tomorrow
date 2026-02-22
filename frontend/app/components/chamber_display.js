// frontend/app/components/chamber_display.js

/**
 * ChamberDisplay
 *
 * Shows chamber activity state and last chamber output.
 */

import appState from "../state/app_state";

class ChamberDisplay {
  constructor(selector) {
    this.el = document.querySelector(selector);

    if (!this.el) {
      console.error("ChamberDisplay: element not found:", selector);
      return;
    }

    // Subscribe to chamber state updates
    appState.chamber.subscribe((snapshot) => {
      this.render(snapshot);
    });

    // Initial render
    this.render(appState.chamber.getSnapshot());
  }

  render(snapshot) {
    if (!snapshot) return;

    const { active, lastPrompt, lastOutput } = snapshot;

    this.el.innerHTML = `
      <div class="chamber-status">
        Status: ${active ? "Running…" : "Idle"}
      </div>
      <div class="chamber-last-prompt">
        <strong>Last Prompt:</strong> ${lastPrompt || ""}
      </div>
      <div class="chamber-last-output">
        <strong>Last Output:</strong> ${lastOutput || ""}
      </div>
    `;
  }

  clear() {
    this.el.innerHTML = "";
  }
}

export default ChamberDisplay;
