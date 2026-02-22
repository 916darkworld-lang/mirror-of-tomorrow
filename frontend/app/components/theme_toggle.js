// frontend/app/components/theme_toggle.js

/**
 * ThemeToggle
 *
 * Toggles between light/dark themes using ThemeState.
 */

import appState from "../state/app_state";

class ThemeToggle {
  constructor(selector) {
    this.el = document.querySelector(selector);

    if (!this.el) {
      console.error("ThemeToggle: element not found:", selector);
      return;
    }

    this.el.addEventListener("click", () => {
      appState.theme.toggle();
    });

    // Subscribe to theme changes
    appState.theme.subscribe((mode) => {
      this.applyTheme(mode);
    });

    // Initial apply
    this.applyTheme(appState.theme.get());
  }

  applyTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
  }
}

export default ThemeToggle;
