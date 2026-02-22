// frontend/app/controllers/keyboard_controller.js

/**
 * KeyboardController
 *
 * Centralized keyboard‑shortcut handler.
 *
 * This keeps all keybindings in one place so they never get scattered
 * across components. You can expand this later with:
 *  - multi‑key combos
 *  - mode‑specific bindings
 *  - user‑customizable shortcuts
 */

import appState from "../state/app_state";

class KeyboardController {
  constructor(config) {
    /**
     * config = {
     *   onSend: fn,
     *   onNext: fn,
     *   onMix: fn,
     *   onChamber: fn
     * }
     */

    this.onSend = config.onSend;
    this.onNext = config.onNext;
    this.onMix = config.onMix;
    this.onChamber = config.onChamber;

    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("keydown", (e) => {
      // Enter = Send
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (typeof this.onSend === "function") this.onSend(appState.prompt.get());
        return;
      }

      // Ctrl+N = Next
      if (e.ctrlKey && e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (typeof this.onNext === "function") this.onNext();
        return;
      }

      // Ctrl+M = Mix
      if (e.ctrlKey && e.key.toLowerCase() === "m") {
        e.preventDefault();
        if (typeof this.onMix === "function") this.onMix();
        return;
      }

      // Ctrl+Shift+C = Chamber
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        if (typeof this.onChamber === "function") this.onChamber();
        return;
      }
    });
  }
}

export default KeyboardController;
