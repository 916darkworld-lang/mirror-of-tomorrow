/**
 * backend/server.js
 *
 * Main backend server wiring all routes together.
 */

import express from "express";
import bodyParser from "body-parser";
import adminLoginRoute from "./routes/admin_login_route.js";
import adminSubscriptionRoutes from "./routes/admin_subscription_routes.js";
import githubDeployRoute from "./routes/github_deploy_route.js";

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Admin login
app.use(adminLoginRoute);

// Subscription tier + GitHub add-on routes
app.use(adminSubscriptionRoutes);

// GitHub deployment route
app.use(githubDeployRoute);

// Root
app.get("/", (req, res) => {
  res.send("Backend server running.");
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
