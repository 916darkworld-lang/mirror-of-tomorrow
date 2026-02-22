// frontend/app/controllers/output_controller.js

/**
 * OutputController
 *
 * Thin controller that wraps OutputState.
 * Exists so future output logic (multi‑AI comparison views,
 * diffing, highlighting, scoring, blending, etc.) has a clean home.
 */

import appState from "../state/app_state";

class OutputController {
  constructor() {
    // Logic-only controller — no DOM wiring here.
  }

  set(value) {
    if (typeof value !== "string") return;
    appState.output.set(value);
  }

  clear() {
    appState.output.clear();
  }

  get() {
    return appState.output.get();
  }

  subscribe(fn) {
    appState.output.subscribe(fn);
  }
}

export default OutputController;
