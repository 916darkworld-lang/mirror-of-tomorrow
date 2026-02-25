/**
 * frontend/app/controllers/ai_window_manager.js
 *
 * Manages opening and closing AI windows using the enforcer.
 */

import aiWindowEnforcer from "./ai_window_enforcer.js";

class AIWindowManager {
  constructor() {
    this.windows = [];
  }

  openAIWindow(type) {
    if (!aiWindowEnforcer.canOpenNewWindow()) {
      alert("AI window limit reached for your subscription tier.");
      return null;
    }

    const win = window.open(`/frontend/ai/${type}.html`, "_blank", "width=500,height=700");

    if (win) {
      aiWindowEnforcer.registerWindowOpen();
      this.windows.push(win);

      const interval = setInterval(() => {
        if (win.closed) {
          clearInterval(interval);
          aiWindowEnforcer.registerWindowClose();
          this.windows = this.windows.filter(w => w !== win);
        }
      }, 500);
    }

    return win;
  }

  getOpenWindowCount() {
    return this.windows.length;
  }

  getRemainingSlots() {
    return aiWindowEnforcer.getRemainingSlots();
  }
}

export default new AIWindowManager();
