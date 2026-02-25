/**
 * frontend/app/ui/ai_window_buttons.js
 *
 * Connects UI buttons to AI window manager and enforces subscription limits.
 */

import aiWindowManager from "../controllers/ai_window_manager.js";
import subscriptionState from "../state/subscription_state.js";

function setupAIButtons() {
  const buttons = document.querySelectorAll("[data-ai-type]");

  buttons.forEach(btn => {
    const type = btn.getAttribute("data-ai-type");

    btn.addEventListener("click", () => {
      aiWindowManager.openAIWindow(type);
      updateButtonStates();
    });
  });

  updateButtonStates();
}

function updateButtonStates() {
  const remaining = aiWindowManager.getRemainingSlots();
  const limit = subscriptionState.getAIWindowLimit();

  const buttons = document.querySelectorAll("[data-ai-type]");

  buttons.forEach(btn => {
    if (remaining <= 0) {
      btn.disabled = true;
      btn.style.opacity = "0.4";
      btn.title = `AI window limit reached (${limit} windows allowed).`;
    } else {
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.title = "";
    }
  });
}

window.addEventListener("DOMContentLoaded", setupAIButtons);
