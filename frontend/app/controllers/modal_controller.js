// frontend/app/controllers/modal_controller.js

/**
 * ModalController
 *
 * Centralized controller for modal windows.
 * Keeps open/close/toggle logic consistent across the app.
 *
 * Responsibilities:
 *  - open/close/toggle modals
 *  - apply/remove animation classes
 *  - trap focus (future)
 *  - backdrop handling (future)
 */

class ModalController {
  constructor(config = {}) {
    /**
     * config = {
     *   modals: {
     *     settings: "#settingsModal",
     *     about: "#aboutModal",
     *     confirm: "#confirmModal"
     *   },
     *   animationClass: "modal-animate",
     *   backdropSelector: "#modalBackdrop"
     * }
     */

    this.modals = {};
    this.active = null;

    this.animationClass = config.animationClass || "modal-animate";

    for (const key in config.modals) {
      const selector = config.modals[key];
      const el = document.querySelector(selector);

      if (!el) {
        console.error(`ModalController: missing modal element for ${key}:`, selector);
      }

      this.modals[key] = el;
    }

    this.backdrop = document.querySelector(config.backdropSelector || null);
  }

  open(name) {
    const modal = this.modals[name];
    if (!modal) {
      console.error("ModalController: unknown modal:", name);
      return;
    }

    modal.style.display = "block";
    modal.classList.add(this.animationClass);

    if (this.backdrop) {
      this.backdrop.style.display = "block";
      this.backdrop.classList.add(this.animationClass);
    }

    this.active = name;
  }

  close(name) {
    const modal = this.modals[name];
    if (!modal) return;

    modal.classList.remove(this.animationClass);
    modal.style.display = "none";

    if (this.backdrop) {
      this.backdrop.classList.remove(this.animationClass);
      this.backdrop.style.display = "none";
    }

    if (this.active === name) {
      this.active = null;
    }
  }

  toggle(name) {
    if (this.active === name) {
      this.close(name);
    } else {
      this.open(name);
    }
  }

  closeAll() {
    for (const key in this.modals) {
      this.close(key);
    }
    this.active = null;
  }

  getActive() {
    return this.active;
  }
}

export default ModalController;
