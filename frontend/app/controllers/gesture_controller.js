// frontend/app/controllers/gesture_controller.js

/**
 * GestureController
 *
 * Centralized handler for touch and gesture interactions.
 * This keeps swipe/tap/hold logic out of components and ensures
 * consistent behavior across mobile devices (Kiwi Browser included).
 *
 * Responsibilities:
 *  - swipe left/right for navigation
 *  - swipe up/down for panel expansion (future)
 *  - long‑press detection
 *  - tap‑to‑focus or tap‑to‑toggle behaviors
 */

class GestureController {
  constructor(config = {}) {
    /**
     * config = {
     *   onSwipeLeft: fn,
     *   onSwipeRight: fn,
     *   onSwipeUp: fn,
     *   onSwipeDown: fn,
     *   onLongPress: fn,
     *   longPressDelay: 500
     * }
     */

    this.onSwipeLeft = config.onSwipeLeft;
    this.onSwipeRight = config.onSwipeRight;
    this.onSwipeUp = config.onSwipeUp;
    this.onSwipeDown = config.onSwipeDown;
    this.onLongPress = config.onLongPress;

    this.longPressDelay = config.longPressDelay || 500;

    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;

    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("touchstart", (e) => {
      const t = e.touches[0];
      this.touchStartX = t.clientX;
      this.touchStartY = t.clientY;
      this.touchStartTime = Date.now();

      this.longPressTimer = setTimeout(() => {
        if (typeof this.onLongPress === "function") {
          this.onLongPress(e);
        }
      }, this.longPressDelay);
    });

    document.addEventListener("touchmove", () => {
      // Moving cancels long press
      clearTimeout(this.longPressTimer);
    });

    document.addEventListener("touchend", (e) => {
      clearTimeout(this.longPressTimer);

      const t = e.changedTouches[0];
      const dx = t.clientX - this.touchStartX;
      const dy = t.clientY - this.touchStartY;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // Swipe detection
      if (absX > 50 || absY > 50) {
        if (absX > absY) {
          if (dx < 0 && typeof this.onSwipeLeft === "function") {
            this.onSwipeLeft(e);
          } else if (dx > 0 && typeof this.onSwipeRight === "function") {
            this.onSwipeRight(e);
          }
        } else {
          if (dy < 0 && typeof this.onSwipeUp === "function") {
            this.onSwipeUp(e);
          } else if (dy > 0 && typeof this.onSwipeDown === "function") {
            this.onSwipeDown(e);
          }
        }
      }
    });
  }
}

export default GestureController;
