// frontend/app/controllers/animation_controller.js

/**
 * AnimationController
 *
 * Centralized controller for triggering CSS‑based animations.
 * Keeps animation logic consistent and prevents scattered class toggles.
 *
 * Responsibilities:
 *  - play one‑shot animations on any element
 *  - apply/remove animation classes cleanly
 *  - provide a unified API for future animation packs
 */

class AnimationController {
  constructor(config = {}) {
    /**
     * config = {
     *   defaultClass: "animate",
     *   duration: 300 // ms
     * }
     */

    this.defaultClass = config.defaultClass || "animate";
    this.duration = config.duration || 300;
  }

  /**
   * Play a one‑shot animation on an element.
   * Automatically removes the class after the duration.
   */
  play(selector, animationClass = this.defaultClass) {
    const el = document.querySelector(selector);
    if (!el) {
      console.error("AnimationController: element not found:", selector);
      return;
    }

    el.classList.add(animationClass);

    setTimeout(() => {
      el.classList.remove(animationClass);
    }, this.duration);
  }

  /**
   * Add an animation class without auto‑removal.
   */
  add(selector, animationClass = this.defaultClass) {
    const el = document.querySelector(selector);
    if (!el) {
      console.error("AnimationController: element not found:", selector);
      return;
    }
    el.classList.add(animationClass);
  }

  /**
   * Remove an animation class.
   */
  remove(selector, animationClass = this.defaultClass) {
    const el = document.querySelector(selector);
    if (!el) {
      console.error("AnimationController: element not found:", selector);
      return;
    }
    el.classList.remove(animationClass);
  }
}

export default AnimationController;
