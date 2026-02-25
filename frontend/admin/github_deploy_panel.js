/**
 * frontend/admin/github_deploy_panel.js
 *
 * Handles GitHub deployment button actions in the admin dashboard.
 */

async function triggerGitHubDeployment() {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    alert("Not authenticated as admin.");
    window.location.href = "/admin/admin_login.html";
    return;
  }

  const response = await fetch("/admin/deploy-github", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const result = await response.json();

  if (!result.success) {
    alert("Deployment failed: " + result.message);
    return;
  }

  alert("GitHub deployment completed successfully.");
}
