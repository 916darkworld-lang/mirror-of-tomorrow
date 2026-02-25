/**
 * backend/routes/github_deploy_route.js
 *
 * Route for triggering GitHub auto-deployment.
 */

import express from "express";
import githubDeployController from "../controllers/github_deploy_controller.js";

const router = express.Router();

router.post("/admin/deploy-github", (req, res) => {
  githubDeployController.deploy(req, res);
});

export default router;
