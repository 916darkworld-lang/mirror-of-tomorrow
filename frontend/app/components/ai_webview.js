// frontend/app/components/ai_webview.js

/**
 * AIWebView
 *
 * Wraps a <webview> or <iframe> element used to load an AI provider.
 * Handles:
 *  - loading a URL
 *  - sending messages (if supported)
 *  - resetting the view
 */

class AIWebView {
  constructor(selector) {
    this.el = document.querySelector(selector);

    if (!this.el) {
      console.error("AIWebView: element not found:", selector);
      return;
    }
  }

  load(url) {
    if (!url || typeof url !== "string") return;
    this.el.src = url;
  }

  reload() {
    if (this.el && this.el.src) {
      this.el.src = this.el.src;
    }
  }

  clear() {
    this.el.src = "about:blank";
  }

  getElement() {
    return this.el;
  }
}

export default AIWebView;
