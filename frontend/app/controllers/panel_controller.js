// frontend/app/controllers/panel_controller.js

/**
 * PanelController
 *
 * Centralized controller for showing/hiding UI panels with optional
 * animation classes. This keeps panel logic consistent and prevents
 * duplication across the app.
 *
 * Responsibilities:
 *  - open/close/toggle panels
 *  - apply animation classes
 *  - track active panel
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
     *   animationClass: "panel-animate"
     * }
     */

    this.panels = {};
    this.active = null;

    this.animationClass = config.animationClass || "panel-animate";

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

    panel.style.display = "block";
    panel.classList.add(this.animationClass);

    this.active = name;
  }

  close(name) {
    const panel = this.panels[name];
    if (!panel) return;

    panel.classList.remove(this.animationClass);
    panel.style.display = "none";

    if (this.active === name) {
      this.active = null;
    }
  }

  toggle(name) {
    if (this.active === name) {
      this.close(name);
    } else {
      this.open(name);
    }
  }

  closeAll() {
    for (const key in this.panels) {
      this.close(key);
    }
    this.active = null;
  }

  getActive() {
    return this.active;
  }
}

export default PanelController;
