// frontend/app/controllers/navigation_controller.js

/**
 * NavigationController
 *
 * Centralized controller for handling navigation between UI sections.
 * This keeps navigation logic out of components and prevents duplication.
 *
 * Responsibilities:
 *  - switching between panels (main, history, settings, chamber, etc.)
 *  - applying active classes
 *  - exposing a clean API for future navigation rules
 */

class NavigationController {
  constructor(config) {
    /**
     * config = {
     *   sections: {
     *     main: "#mainPanel",
     *     history: "#historyPanel",
     *     settings: "#settingsPanel",
     *     chamber: "#chamberPanel"
     *   },
     *   default: "main"
     * }
     */

    this.sections = {};
    this.active = null;

    for (const key in config.sections) {
      const selector = config.sections[key];
      const el = document.querySelector(selector);

      if (!el) {
        console.error(`NavigationController: missing section element for ${key}:`, selector);
      }

      this.sections[key] = el;
    }

    const defaultSection = config.default || "main";
    this.show(defaultSection);
  }

  show(name) {
    if (!this.sections[name]) {
      console.error("NavigationController: unknown section:", name);
      return;
    }

    // Hide all
    for (const key in this.sections) {
      const el = this.sections[key];
      if (el) el.style.display = "none";
    }

    // Show target
    const target = this.sections[name];
    if (target) target.style.display = "block";

    this.active = name;
  }

  getActive() {
    return this.active;
  }

  /**
   * Future expansion:
   *  - animated transitions
   *  - navigation guards
   *  - multi‑panel layouts
   */
}

export default NavigationController;
