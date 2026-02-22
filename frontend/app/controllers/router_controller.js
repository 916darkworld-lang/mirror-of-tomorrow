// frontend/app/controllers/router_controller.js

/**
 * RouterController
 *
 * A minimal client‑side router for switching views based on hash changes.
 * This keeps navigation logic centralized and prevents scattered listeners.
 *
 * Responsibilities:
 *  - listen to hash changes
 *  - map routes to view names
 *  - notify ViewController (or any subscriber)
 */

class RouterController {
  constructor(config = {}) {
    /**
     * config = {
     *   routes: {
     *     "": "home",
     *     "#home": "home",
     *     "#dashboard": "dashboard",
     *     "#settings": "settings"
     *   },
     *   onRoute: (viewName) => {}
     * }
     */

    this.routes = config.routes || {};
    this.onRoute = config.onRoute || null;

    this._bind();
    this._handleRoute();
  }

  _bind() {
    window.addEventListener("hashchange", () => this._handleRoute());
  }

  _handleRoute() {
    const hash = window.location.hash || "";
    const viewName = this.routes[hash];

    if (!viewName) {
      console.error("RouterController: unknown route:", hash);
      return;
    }

    if (typeof this.onRoute === "function") {
      this.onRoute(viewName);
    }
  }

  navigate(hash) {
    window.location.hash = hash;
  }
}

export default RouterController;
