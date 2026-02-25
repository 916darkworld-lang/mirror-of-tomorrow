/**
 * backend/controllers/github_deploy_controller.js
 *
 * Handles GitHub deployment requests.
 * Uses subscriptionState to enforce tier restrictions.
 */

import subscriptionState from "../../frontend/app/state/subscription_state.js";
import { exec } from "child_process";

class GitHubDeployController {
  constructor() {}

  deploy(req, res) {
    // Check if user is allowed to use GitHub automation
    if (!subscriptionState.canUseGitHubAutomation()) {
      return res.status(403).json({
        success: false,
        message: "GitHub auto-deployment is not available for this tier."
      });
    }

    // Run deployment script
    exec("sh ./deploy_to_github.sh", (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Deployment failed.",
          error: stderr
        });
      }

      return res.json({
        success: true,
        message: "Deployment completed.",
        output: stdout
      });
    });
  }
}

export default new GitHubDeployController();
