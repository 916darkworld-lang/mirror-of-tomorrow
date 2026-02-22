// frontend/app/controllers/theme_controller.js

/**
 * ThemeController
 *
 * Thin controller that wraps ThemeState.
 * This exists so future theme logic (animations, transitions,
 * user presets, saved preferences, etc.) has a clean home.
 */

import appState from "../state/app_state";

class ThemeController {
  constructor() {
    // No DOM wiring here — logic only.
  }

  toggle() {
    appState.theme.toggle();
  }

  set(mode) {
    if (mode !== "light" && mode !== "dark") return;
    appState.theme.set(mode);
  }

  get() {
    return appState.theme.get();
  }

  subscribe(fn) {
    appState.theme.subscribe(fn);
  }
}

export default ThemeController;
