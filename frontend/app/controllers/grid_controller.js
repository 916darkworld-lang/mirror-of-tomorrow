// frontend/app/controllers/grid_controller.js

/**
 * GridController
 *
 * Thin controller that wraps AIGrid.
 * Exists so future grid logic (dynamic slot assignment,
 * per‑AI refresh, layout transitions, etc.) has a clean home.
 */

import AIGrid from "../components/ai_grid";

class GridController {
  constructor(config) {
    /**
     * config = {
     *   slots: [
     *     { selector: "#ai1", url: "..." },
     *     { selector: "#ai2", url: "..." },
     *     ...
     *   ]
     * }
     */
    this.grid = new AIGrid(config);
  }

  loadAll() {
    this.grid.loadAll();
  }

  reloadAll() {
    this.grid.reloadAll();
  }

  clearAll() {
    this.grid.clearAll();
  }

  getViews() {
    return this.grid.getViews();
  }
}

export default GridController;
