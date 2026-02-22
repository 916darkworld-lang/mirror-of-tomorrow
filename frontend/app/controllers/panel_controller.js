// frontend/app/controllers/panel_controller.js

/**
 * PanelController
 *
 * Centralized controller for expanding/collapsing UI panels.
 * Prevents scattered DOM toggles and keeps panel behavior consistent.
 *
 * Responsibilities:
 *  - open/close/toggle panels
 *  - apply active/inactive classes
 *  - optional animation hooks
 */

class PanelController {
  constructor(config = {}) {
    /**
     * config = {
     *   panels: {
     *     left: "#leftPanel",
     *     right: "#rightPanel",
     *     bottom: "#bottomPanel"
     *   },
     *   openClass: "panel-open",
     *   closedClass: "panel-closed"
     * }
     */

    this.panels = {};
    this.openClass = config.openClass || "panel-open";
    this.closedClass = config.closedClass || "panel-closed";

    for (const key in config.panels) {
      const selector = config.panels[key];
      const el = document.querySelector(selector);

      if (!el) {
        console.error(`PanelController: missing panel element for ${key}:`, selector);
      }

      this.panels[key] = el;
    }
  }

  open(name) {
    const panel = this.panels[name];
    if (!panel) {
      console.error("PanelController: unknown panel:", name);
      return;
    }

    panel.classList.add(this.openClass);
    panel.classList.remove(this.closedClass);
  }

  close(name) {
    const panel = this.panels[name];
    if (!panel) return;

    panel.classList.remove(this.openClass);
    panel.classList.add(this.closedClass);
  }

  toggle(name) {
    const panel = this.panels[name];
    if (!panel) return;

    if (panel.classList.contains(this.openClass)) {
      this.close(name);
    } else {
      this.open(name);
    }
  }

  closeAll() {
    for (const key in this.panels) {
      this.close(key);
    }
  }

  openAll() {
    for (const key in this.panels) {
      this.open(key);
    }
  }
}

export default PanelController;
