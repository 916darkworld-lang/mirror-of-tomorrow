// frontend/app/controllers/tooltip_controller.js

/**
 * TooltipController
 *
 * Centralized controller for lightweight tooltips.
 * Keeps hover/focus tooltip behavior consistent across the app.
 *
 * Responsibilities:
 *  - show/hide tooltips
 *  - position tooltips relative to target elements
 *  - optional animation classes
 */

class TooltipController {
  constructor(config = {}) {
    /**
     * config = {
     *   tooltipSelector: "#tooltip",
     *   animationClass: "tooltip-animate",
     *   offsetX: 10,
     *   offsetY: 10
     * }
     */

    this.tooltipEl = document.querySelector(config.tooltipSelector);
    this.animationClass = config.animationClass || "tooltip-animate";

    this.offsetX = config.offsetX || 10;
    this.offsetY = config.offsetY || 10;

    if (!this.tooltipEl) {
      console.error("TooltipController: tooltip element not found:", config.tooltipSelector);
    }

    this.currentTarget = null;
  }

  show(target, text) {
    if (!this.tooltipEl) return;

    this.currentTarget = target;
    this.tooltipEl.textContent = text;

    const rect = target.getBoundingClientRect();

    this.tooltipEl.style.left = rect.left + this.offsetX + "px";
    this.tooltipEl.style.top = rect.top + this.offsetY + "px";

    this.tooltipEl.style.display = "block";
    this.tooltipEl.classList.add(this.animationClass);
  }

  hide() {
    if (!this.tooltipEl) return;

    this.tooltipEl.classList.remove(this.animationClass);
    this.tooltipEl.style.display = "none";

    this.currentTarget = null;
  }

  attach(selector, text) {
    const el = document.querySelector(selector);
    if (!el) {
      console.error("TooltipController: attach target not found:", selector);
      return;
    }

    el.addEventListener("mouseenter", () => this.show(el, text));
    el.addEventListener("mouseleave", () => this.hide());
    el.addEventListener("focus", () => this.show(el, text));
    el.addEventListener("blur", () => this.hide());
  }
}

export default TooltipController;
