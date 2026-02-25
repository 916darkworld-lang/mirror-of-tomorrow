/**
 * frontend/app/controllers/ai_window_enforcer.js
 *
 * Enforces AI window limits based on subscription tier.
 */

import subscriptionState from "../state/subscription_state.js";

class AIWindowEnforcer {
  constructor() {
    this.openWindows = 0;
  }

  canOpenNewWindow() {
    const limit = subscriptionState.getAIWindowLimit();
    return this.openWindows < limit;
  }

  registerWindowOpen() {
    this.openWindows++;
  }

  registerWindowClose() {
    if (this.openWindows > 0) {
      this.openWindows--;
    }
  }

  getRemainingSlots() {
    const limit = subscriptionState.getAIWindowLimit();
    return limit - this.openWindows;
  }
}

export default new AIWindowEnforcer();
