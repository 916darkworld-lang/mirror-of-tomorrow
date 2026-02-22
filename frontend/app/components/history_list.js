// frontend/app/components/history_list.js

/**
 * HistoryList
 *
 * Renders the prompt/output history and updates when HistoryState changes.
 */

import appState from "../state/app_state";

class HistoryList {
  constructor(selector) {
    this.el = document.querySelector(selector);

    if (!this.el) {
      console.error("HistoryList: element not found:", selector);
      return;
    }

    // Subscribe to history updates
    appState.history.subscribe((items) => {
      this.render(items);
    });

    // Initial render
    this.render(appState.history.getAll());
  }

  render(items) {
    if (!Array.isArray(items)) return;

    this.el.innerHTML = items
      .map(
        (item) => `
          <div class="history-item">
            <div class="history-prompt">${item.prompt}</div>
            <div class="history-output">${item.output}</div>
            <div class="history-time">${new Date(
              item.timestamp
            ).toLocaleTimeString()}</div>
          </div>
        `
      )
      .join("");
  }

  clear() {
    this.el.innerHTML = "";
  }
}

export default HistoryList;
