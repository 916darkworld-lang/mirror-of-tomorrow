/**
 * backend/routes/admin_subscription_routes.js
 *
 * Admin routes for updating subscription tier
 * and toggling GitHub deployment add-on.
 */

import express from "express";
import subscriptionState from "../../frontend/app/state/subscription_state.js";

const router = express.Router();

// Update subscription tier
router.post("/admin/set-tier", (req, res) => {
  const { tier } = req.body;

  if (!tier) {
    return res.status(400).json({
      success: false,
      message: "Tier is required"
    });
  }

  subscriptionState.setTier(tier);

  return res.json({
    success: true,
    message: `Tier updated to ${tier}`
  });
});

// Toggle GitHub add-on
router.post("/admin/toggle-github-addon", (req, res) => {
  if (subscriptionState.githubAddOn) {
    subscriptionState.disableGitHubAddOn();
  } else {
    subscriptionState.enableGitHubAddOn();
  }

  return res.json({
    success: true,
    githubAddOn: subscriptionState.githubAddOn
  });
});

export default router;
