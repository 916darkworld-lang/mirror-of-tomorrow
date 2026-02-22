// frontend/app/controllers/theme_controller.js

/**
 * ThemeController
 *
 * Centralized controller for applying and switching UI themes.
 * Keeps theme logic consistent and prevents scattered class toggles.
 *
 * Responsibilities:
 *  - apply light/dark/system themes
 *  - persist theme choice (optional)
 *  - expose clean API for future theme packs
 */

class ThemeController {
  constructor(config = {}) {
    /**
     * config = {
     *   rootSelector: "#app",
     *   storageKey: "theme",
     *   default: "dark", // "light" | "dark" | "system"
     *   persist: true
     * }
     */

    this.rootEl = document.querySelector(config.rootSelector);
    this.storageKey = config.storageKey || "theme";
    this.persist = config.persist !== false;

    this.theme = this.persist
      ? this._load() || config.default || "dark"
      : config.default || "dark";

    if (!this.rootEl) {
      console.error("ThemeController: root element not found:", config.rootSelector);
    }

    this.apply(this.theme);
  }

  // ----- Persistence -----
  _load() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (err) {
      console.error("ThemeController: failed to load theme", err);
      return null;
    }
  }

  _save(theme) {
    if (!this.persist) return;
    try {
      localStorage.setItem(this.storageKey, theme);
    } catch (err) {
      console.error("ThemeController: failed to save theme", err);
    }
  }

  // ----- Theme Application -----
  apply(theme) {
    if (!this.rootEl) return;

    this.theme = theme;

    this.rootEl.classList.remove("theme-light", "theme-dark", "theme-system");

    if (theme === "light") {
      this.rootEl.classList.add("theme-light");
    } else if (theme === "dark") {
      this.rootEl.classList.add("theme-dark");
    } else if (theme === "system") {
      this.rootEl.classList.add("theme-system");
    }

    this._save(theme);
  }

  set(theme) {
    this.apply(theme);
  }

  get() {
    return this.theme;
  }

  toggle() {
    if (this.theme === "light") {
      this.apply("dark");
    } else {
      this.apply("light");
    }
  }
}

export default ThemeController;
