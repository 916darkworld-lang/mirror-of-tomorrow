// frontend/app/controllers/error_controller.js

/**
 * ErrorController
 *
 * Thin controller that wraps ErrorState.
 * Exists so future error-handling logic (retry flows, categorized errors,
 * per-AI error mapping, UI escalation, etc.) has a clean home.
 */

import appState from "../state/app_state";

class ErrorController {
  constructor() {
    // Logic-only controller — no DOM wiring here.
  }

  set(message) {
    if (!message) return;
    appState.error.set(message);
  }

  clear() {
    appState.error.clear();
  }

  get() {
    return appState.error.get();
  }

  subscribe(fn) {
    appState.error.subscribe(fn);
  }
}

export default ErrorController;
