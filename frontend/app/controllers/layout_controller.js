// frontend/app/controllers/layout_controller.js

/**
 * LayoutController
 *
 * Centralized controller for layout‑level behaviors:
 *  - resizing logic
 *  - responsive class toggles
 *  - grid mode switching (future)
 *  - viewport recalculations
 *
 * This keeps layout logic out of components and prevents duplication.
 */

class LayoutController {
  constructor(config) {
    /**
     * config = {
     *   rootSelector: "#app",
     *   breakpoint: 800   // px
     * }
     */

    this.rootEl = document.querySelector(config.rootSelector);
    this.breakpoint = config.breakpoint || 800;

    if (!this.rootEl) {
      console.error("LayoutController: root element not found:", config.rootSelector);
    }

    this.bindEvents();
    this.applyResponsiveClass();
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.applyResponsiveClass();
    });
  }

  applyResponsiveClass() {
    if (!this.rootEl) return;

    const width = window.innerWidth;

    if (width <= this.breakpoint) {
      this.rootEl.classList.add("mobile");
      this.rootEl.classList.remove("desktop");
    } else {
      this.rootEl.classList.add("desktop");
      this.rootEl.classList.remove("mobile");
    }
  }

  isMobile() {
    return window.innerWidth <= this.breakpoint;
  }

  isDesktop() {
    return window.innerWidth > this.breakpoint;
  }
}

export default LayoutController;
