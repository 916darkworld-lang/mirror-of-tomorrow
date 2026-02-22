// frontend/app/components/loading_spinner.js

/**
 * LoadingSpinner
 *
 * Shows or hides a loading indicator based on LoadingState.
 */

import appState from "../state/app_state";

class LoadingSpinner {
  constructor(selector) {
    this.el = document.querySelector(selector);

    if (!this.el) {
      console.error("LoadingSpinner: element not found:", selector);
      return;
    }

    // Subscribe to loading state
    appState.loading.subscribe((isLoading) => {
      this.render(isLoading);
    });

    // Initial render
    this.render(appState.loading.isLoading());
  }

  render(isLoading) {
    this.el.style.display = isLoading ? "block" : "none";
  }

  show() {
    this.el.style.display = "block";
  }

  hide() {
    this.el.style.display = "none";
  }
}

export default LoadingSpinner;
