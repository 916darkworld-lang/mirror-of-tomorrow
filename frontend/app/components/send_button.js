// frontend/app/components/send_button.js

/**
 * SendButton
 *
 * Handles the "Send" action — triggers a callback when clicked.
 * The logic for sending the prompt lives elsewhere; this is only the UI trigger.
 */

class SendButton {
  constructor(selector, onSend) {
    this.el = document.querySelector(selector);
    this.onSend = onSend;

    if (!this.el) {
      console.error("SendButton: element not found:", selector);
      return;
    }

    this.el.addEventListener("click", () => {
      if (typeof this.onSend === "function") {
        this.onSend();
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

export default SendButton;
