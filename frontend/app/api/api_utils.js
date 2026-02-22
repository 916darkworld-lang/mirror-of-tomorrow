// frontend/app/api/api_utils.js

/**
 * API Utilities
 *
 * Shared helpers for API operations:
 *  - safeJSON(response)
 *  - withTimeout(promise, ms)
 *  - sanitizePrompt(prompt)
 */

export async function safeJSON(response) {
  try {
    return await response.json();
  } catch (err) {
    console.error("safeJSON parse error:", err);
    return null;
  }
}

export function withTimeout(promise, ms = 10000) {
  let timeoutId;

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Request timed out."));
    }, ms);
  });

  return Promise.race([
    promise.finally(() => clearTimeout(timeoutId)),
    timeout,
  ]);
}

export function sanitizePrompt(prompt) {
  if (typeof prompt !== "string") return "";
  return prompt.trim().slice(0, 5000); // hard limit for safety
}
