// frontend/app/components/next_button.js

/**
 * NextButton
 *
 * Handles the "Next" action — triggers a callback when clicked.
 * The logic for advancing steps lives elsewhere; this is only the UI trigger.
 */

class NextButton {
  constructor(selector, onNext) {
    this.el = document.querySelector(selector);
    this.onNext = onNext;

    if (!this.el) {
      console.error("NextButton: element not found:", selector);
      return;
    }

    this.el.addEventListener("click", () => {
      if (typeof this.onNext === "function") {
        this.onNext();
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

export default NextButton;
