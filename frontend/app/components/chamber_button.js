// frontend/app/components/chamber_button.js

/**
 * ChamberButton
 *
 * Handles the "Chamber" action — triggers a callback when clicked.
 * The chamber logic itself lives elsewhere; this is only the UI trigger.
 */

class ChamberButton {
  constructor(selector, onChamber) {
    this.el = document.querySelector(selector);
    this.onChamber = onChamber;

    if (!this.el) {
      console.error("ChamberButton: element not found:", selector);
      return;
    }

    this.el.addEventListener("click", () => {
      if (typeof this.onChamber === "function") {
        this.onChamber();
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

export default ChamberButton;
