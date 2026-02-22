// frontend/app/controllers/view_controller.js

/**
 * ViewController
 *
 * Centralized controller for showing/hiding high‑level views or screens.
 * This keeps navigation logic consistent and prevents scattered DOM toggles.
 *
 * Responsibilities:
 *  - switch between named views
 *  - apply active/inactive classes
 *  - expose clean API for future transitions or animations
 */

class ViewController {
  constructor(config = {}) {
    /**
     * config = {
     *   views: {
     *     home: "#homeView",
     *     dashboard: "#dashboardView",
     *     settings: "#settingsView"
     *   },
     *   activeClass: "view-active",
     *   hiddenClass: "view-hidden"
     * }
     */

    this.views = {};
    this.active = null;

    this.activeClass = config.activeClass || "view-active";
    this.hiddenClass = config.hiddenClass || "view-hidden";

    for (const key in config.views) {
      const selector = config.views[key];
      const el = document.querySelector(selector);

      if (!el) {
        console.error(`ViewController: missing view element for ${key}:`, selector);
      }

      this.views[key] = el;
    }
  }

  show(name) {
    const view = this.views[name];
    if (!view) {
      console.error("ViewController: unknown view:", name);
      return;
    }

    for (const key in this.views) {
      const el = this.views[key];
      if (!el) continue;

      if (key === name) {
        el.classList.add(this.activeClass);
        el.classList.remove(this.hiddenClass);
      } else {
        el.classList.remove(this.activeClass);
        el.classList.add(this.hiddenClass);
      }
    }

    this.active = name;
  }

  hide(name) {
    const view = this.views[name];
    if (!view) return;

    view.classList.remove(this.activeClass);
    view.classList.add(this.hiddenClass);

    if (this.active === name) {
      this.active = null;
    }
  }

  toggle(name) {
    if (this.active === name) {
      this.hide(name);
    } else {
      this.show(name);
    }
  }

  getActive() {
    return this.active;
  }
}

export default ViewController;
