// frontend/app/controllers/animation_controller.js

/**
 * AnimationController
 *
 * Centralized controller for enabling/disabling animations
 * and applying animation classes in a consistent way.
 *
 * This keeps animation logic out of components and prevents
 * scattered CSS‑class manipulation.
 */

class AnimationController {
  constructor(config = {}) {
    /**
     * config = {
     *   rootSelector: "#app",
     *   enabled: true
     * }
     */

    this.rootEl = document.querySelector(config.rootSelector);
    this.enabled = config.enabled !== false;

    if (!this.rootEl) {
      console.error("AnimationController: root element not found:", config.rootSelector);
    }

    this.apply();
  }

  enable() {
    this.enabled = true;
    this.apply();
  }

  disable() {
    this.enabled = false;
    this.apply();
  }

  toggle() {
    this.enabled = !this.enabled;
    this.apply();
  }

  apply() {
    if (!this.rootEl) return;

    if (this.enabled) {
      this.rootEl.classList.add("animations-on");
      this.rootEl.classList.remove("animations-off");
    } else {
      this.rootEl.classList.add("animations-off");
      this.rootEl.classList.remove("animations-on");
    }
  }

  isEnabled() {
    return this.enabled;
  }
}

export default AnimationController;
