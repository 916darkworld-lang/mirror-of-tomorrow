// frontend/app/components/ai_grid.js

/**
 * AIGrid
 *
 * Manages the layout and control of multiple AIWebView instances.
 * Does NOT handle logic — only DOM and view coordination.
 */

import AIWebView from "./ai_webview";

class AIGrid {
  constructor(config) {
    /**
     * config = {
     *   slots: [
     *     { selector: "#ai1", url: "https://..." },
     *     { selector: "#ai2", url: "https://..." },
     *     ...
     *   ]
     * }
     */

    this.slots = [];

    if (!config || !Array.isArray(config.slots)) {
      console.error("AIGrid: invalid config");
      return;
    }

    for (const slot of config.slots) {
      const view = new AIWebView(slot.selector);
      if (slot.url) view.load(slot.url);

      this.slots.push({
        selector: slot.selector,
        view,
        url: slot.url || null,
      });
    }
  }

  loadAll() {
    for (const slot of this.slots) {
      if (slot.url) slot.view.load(slot.url);
    }
  }

  reloadAll() {
    for (const slot of this.slots) {
      slot.view.reload();
    }
  }

  clearAll() {
    for (const slot of this.slots) {
      slot.view.clear();
    }
  }

  getViews() {
    return this.slots.map((s) => s.view);
  }
}

export default AIGrid;
