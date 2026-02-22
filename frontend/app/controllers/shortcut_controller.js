// frontend/app/controllers/shortcut_controller.js

/**
 * ShortcutController
 *
 * A dedicated controller for advanced keyboard shortcuts that go
 * beyond the basic bindings handled by KeyboardController.
 *
 * This is where we put:
 *  - multi‑key sequences (e.g., "g" then "h")
 *  - mode‑specific shortcuts
 *  - chorded shortcuts (Ctrl+Shift+X)
 *  - future user‑customizable bindings
 */

class ShortcutController {
  constructor(config = {}) {
    /**
     * config = {
     *   sequences: {
     *     "g h": fn,
     *     "g s": fn
     *   },
     *   chords: {
     *     "ctrl+shift+x": fn,
     *     "alt+m": fn
     *   }
     * }
     */

    this.sequenceMap = config.sequences || {};
    this.chordMap = config.chords || {};

    this.sequenceBuffer = [];
    this.sequenceTimeout = null;
    this.sequenceDelay = 600; // ms

    this.bindEvents();
  }

  bindEvents() {
    document.addEventListener("keydown", (e) => {
      this.handleChord(e);
      this.handleSequence(e);
    });
  }

  // ----- Chords (Ctrl+Shift+X, Alt+M, etc.) -----
  handleChord(e) {
    const parts = [];

    if (e.ctrlKey) parts.push("ctrl");
    if (e.shiftKey) parts.push("shift");
    if (e.altKey) parts.push("alt");

    parts.push(e.key.toLowerCase());

    const key = parts.join("+");

    const fn = this.chordMap[key];
    if (typeof fn === "function") {
      e.preventDefault();
      fn();
    }
  }

  // ----- Multi‑key sequences ("g" then "h") -----
  handleSequence(e) {
    const key = e.key.toLowerCase();

    this.sequenceBuffer.push(key);

    clearTimeout(this.sequenceTimeout);
    this.sequenceTimeout = setTimeout(() => {
      this.sequenceBuffer = [];
    }, this.sequenceDelay);

    const bufferString = this.sequenceBuffer.join(" ");

    for (const seq in this.sequenceMap) {
      if (bufferString.endsWith(seq)) {
        const fn = this.sequenceMap[seq];
        if (typeof fn === "function") {
          fn();
          this.sequenceBuffer = [];
        }
      }
    }
  }
}

export default ShortcutController;
