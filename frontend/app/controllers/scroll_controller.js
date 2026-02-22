// frontend/app/controllers/scroll_controller.js

/**
 * ScrollController
 *
 * Centralized controller for scroll behaviors across the app.
 * Prevents scattered scroll logic and keeps UI movement consistent.
 *
 * Responsibilities:
 *  - smooth scrolling to elements
 *  - auto‑scrolling containers (chat, logs, panels)
 *  - locking/unlocking scroll when needed
 */

class ScrollController {
  constructor(config = {}) {
    /**
     * config = {
     *   smooth: true,
     *   behavior: "smooth", // or "auto"
     *   lockClass: "scroll-locked"
     * }
     */

    this.smooth = config.smooth !== false;
    this.behavior = config.behavior || "smooth";
    this.lockClass = config.lockClass || "scroll-locked";
  }

  /**
   * Scroll the page to a specific element.
   */
  to(selector) {
    const el = document.querySelector(selector);
    if (!el) {
      console.error("ScrollController: element not found:", selector);
      return;
    }

    el.scrollIntoView({
      behavior: this.smooth ? this.behavior : "auto",
      block: "start"
    });
  }

  /**
   * Scroll a container to its bottom.
   */
  toBottom(selector) {
    const el = document.querySelector(selector);
    if (!el) {
      console.error("ScrollController: container not found:", selector);
      return;
    }

    el.scrollTo({
      top: el.scrollHeight,
      behavior: this.smooth ? this.behavior : "auto"
    });
  }

  /**
   * Lock scrolling on the body (useful for modals).
   */
  lock() {
    document.body.classList.add(this.lockClass);
  }

  /**
   * Unlock scrolling.
   */
  unlock() {
    document.body.classList.remove(this.lockClass);
  }
}

export default ScrollController;
