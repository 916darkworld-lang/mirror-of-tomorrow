// frontend/app/components/mix_button.js

/**
 * MixButton
 *
 * Handles the "Mix" action — triggers a callback when clicked.
 * The logic of mixing AI outputs lives elsewhere; this is only the UI trigger.
 */

class MixButton {
  constructor(selector, onMix) {
    this.el = document.querySelector(selector);
    this.onMix = onMix;

    if (!this.el) {
      console.error("MixButton: element not found:", selector);
      return;
    }

    this.el.addEventListener("click", () => {
      if (typeof this.onMix === "function") {
        this.onMix();
      }
    });
  }

  enable() {
    this.el.disabled = false;
  }

  disable() {
    this.el.disabled = true;
  }
}

export default MixButton;
