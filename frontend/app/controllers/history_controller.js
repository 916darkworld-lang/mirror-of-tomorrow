// frontend/app/controllers/history_controller.js

/**
 * HistoryController
 *
 * Thin controller for managing history interactions.
 * The actual storage and state updates live in HistoryState.
 *
 * This controller exists so future features (filtering, exporting,
 * searching, pinning, collapsing, etc.) have a clean home.
 */

import appState from "../state/app_state";

class HistoryController {
  constructor() {
    // No DOM wiring yet — this is a logic-only controller.
  }

  add(prompt, output) {
    if (!prompt && !output) return;
    appState.history.add(prompt, output);
  }

  clear() {
    appState.history.clear();
  }

  getAll() {
    return appState.history.getAll();
  }

  getLatest() {
    const all = appState.history.getAll();
    return all.length > 0 ? all[all.length - 1] : null;
  }
}

export default HistoryController;
