// frontend/app/controllers/loading_controller.js

/**
 * LoadingController
 *
 * Thin controller that wraps LoadingState.
 * Exists so future loading logic (multi-phase loading,
 * per-AI loading indicators, progress bars, etc.) has a clean home.
 */

import appState from "../state/app_state";

class LoadingController {
  constructor() {
    // Logic-only controller — no DOM wiring here.
  }

  start() {
    appState.loading.start();
  }

  stop() {
    appState.loading.stop();
  }

  isLoading() {
    return appState.loading.isLoading();
  }

  subscribe(fn) {
    appState.loading.subscribe(fn);
  }
}

export default LoadingController;
