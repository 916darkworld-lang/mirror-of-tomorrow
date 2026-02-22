// frontend/app/controllers/settings_controller.js

/**
 * SettingsController
 *
 * Centralized controller for managing user‑configurable settings.
 * This keeps settings logic clean and isolated from UI components.
 *
 * Responsibilities:
 *  - storing and retrieving settings
 *  - applying settings to the app (theme, layout, behavior)
 *  - providing a clean API for future settings expansion
 */

class SettingsController {
  constructor(config = {}) {
    /**
     * config = {
     *   storageKey: "appSettings"
     * }
     */

    this.storageKey = config.storageKey || "appSettings";
    this.settings = this.load() || {
      theme: "dark",
      autoScroll: true,
      animations: true
    };
  }

  // ----- Persistence -----
  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error("SettingsController: failed to load settings", err);
      return null;
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.settings));
    } catch (err) {
      console.error("SettingsController: failed to save settings", err);
    }
  }

  // ----- Getters / Setters -----
  get(key) {
    return this.settings[key];
  }

  set(key, value) {
    this.settings[key] = value;
    this.save();
  }

  // ----- Specific Settings -----
  setTheme(mode) {
    if (mode !== "light" && mode !== "dark") return;
    this.settings.theme = mode;
    this.save();
  }

  getTheme() {
    return this.settings.theme;
  }

  setAutoScroll(enabled) {
    this.settings.autoScroll = !!enabled;
    this.save();
  }

  getAutoScroll() {
    return this.settings.autoScroll;
  }

  setAnimations(enabled) {
    this.settings.animations = !!enabled;
    this.save();
  }

  getAnimations() {
    return this.settings.animations;
  }
}

export default SettingsController;
