// frontend/app/controllers/layout_controller.js

/**
 * LayoutController
 *
 * Centralized controller for managing layout modes and responsive states.
 * This keeps layout logic consistent and prevents scattered DOM manipulation.
 *
 * Responsibilities:
 *  - switching between layout modes (stacked, grid, chamber, etc.)
 *  - applying responsive classes
 *  - exposing a clean API for future adaptive layouts
 */

class LayoutController {
  constructor(config = {}) {
    /**
     * config = {
     *   rootSelector: "#app",
     *   default: "stacked", // "stacked" | "grid" | "chamber"
     *   storageKey: "layoutMode",
     *   persist: true
     * }
     */

    this.rootEl = document.querySelector(config.rootSelector);
    this.storageKey = config.storageKey || "layoutMode";
    this.persist = config.persist !== false;

    this.mode = this.persist
      ? this._load() || config.default || "stacked"
      : config.default || "stacked";

    if (!this.rootEl) {
      console.error("LayoutController: root element not found:", config.rootSelector);
    }

    this.apply(this.mode);
    this._bindResize();
  }

  // ----- Persistence -----
  _load() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (err) {
      console.error("LayoutController: failed to load layout mode", err);
      return null;
    }
  }

  _save(mode) {
    if (!this.persist) return;
    try {
      localStorage.setItem(this.storageKey, mode);
    } catch (err) {
      console.error("LayoutController: failed to save layout mode", err);
    }
  }

  // ----- Apply Layout -----
  apply(mode) {
    if (!this.rootEl) return;

    this.mode = mode;

    this.rootEl.classList.remove("layout-stacked", "layout-grid", "layout-chamber");

    if (mode === "stacked") {
      this.rootEl.classList.add("layout-stacked");
    } else if (mode === "grid") {
      this.rootEl.classList.add("layout-grid");
    } else if (mode === "chamber") {
      this.rootEl.classList.add("layout-chamber");
    }

    this._save(mode);
  }

  set(mode) {
    this.apply(mode);
  }

  get() {
    return this.mode;
  }

  toggle() {
    if (this.mode === "stacked") {
      this.apply("grid");
    } else if (this.mode === "grid") {
      this.apply("chamber");
    } else {
      this.apply("stacked");
    }
  }

  // ----- Responsive Behavior -----
  _bindResize() {
    window.addEventListener("resize", () => {
      const width = window.innerWidth;

      if (width < 600) {
        this.rootEl.classList.add("layout-mobile");
      } else {
        this.rootEl.classList.remove("layout-mobile");
      }
    });
  }
}

export default LayoutController;
