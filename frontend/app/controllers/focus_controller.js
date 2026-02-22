// frontend/app/controllers/focus_controller.js

/**
 * FocusController
 *
 * Centralized controller for managing focus behavior across the app.
 * This prevents scattered .focus() calls and keeps keyboard navigation clean.
 *
 * Responsibilities:
 *  - programmatic focus switching
 *  - remembering last‑focused element
 *  - restoring focus after view changes
 */

class FocusController {
  constructor() {
    this.lastFocused = null;

    this._bindTracking();
  }

  _bindTracking() {
    document.addEventListener("focusin", (e) => {
      this.lastFocused = e.target;
    });
  }

  focus(selector) {
    const el = document.querySelector(selector);
    if (!el) {
      console.error("FocusController: element not found:", selector);
      return;
    }
    el.focus();
  }

  restore() {
    if (this.lastFocused && document.body.contains(this.lastFocused)) {
      this.lastFocused.focus();
    }
  }

  clear() {
    this.lastFocused = null;
  }
}

export default FocusController;
