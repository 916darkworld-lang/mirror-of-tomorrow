/**
 * backend/auth/admin_auth.js
 *
 * Admin login system with placeholder credentials.
 * Replace ADMIN_USER and ADMIN_PASS with your real values privately.
 */

const ADMIN_USER = process.env.ADMIN_USER || "YOUR_ADMIN_USERNAME";
const ADMIN_PASS = process.env.ADMIN_PASS || "YOUR_ADMIN_PASSWORD";

export function verifyAdminLogin(username, password) {
  return username === ADMIN_USER && password === ADMIN_PASS;
}
