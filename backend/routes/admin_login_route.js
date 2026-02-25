/**
 * backend/routes/admin_login_route.js
 *
 * API route for admin login.
 */

import express from "express";
import { verifyAdminLogin } from "../auth/admin_auth.js";

const router = express.Router();

router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  const valid = verifyAdminLogin(username, password);

  if (!valid) {
    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials"
    });
  }

  // Simple session token (replace with JWT later)
  const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");

  return res.json({
    success: true,
    token
  });
});

export default router;
