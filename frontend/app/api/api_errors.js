// frontend/app/api/api_errors.js

/**
 * APIErrors
 *
 * Centralized error types for API operations.
 * Used by APIClient and UIState to standardize error handling.
 */

export const APIErrors = {
  NETWORK: "NETWORK_ERROR",
  SERVER: "SERVER_ERROR",
  INVALID_RESPONSE: "INVALID_RESPONSE",
  UNKNOWN: "UNKNOWN_ERROR",
};

export function normalizeAPIError(err) {
  if (!err) {
    return { type: APIErrors.UNKNOWN, message: "Unknown error occurred." };
  }

  if (err.name === "TypeError" && err.message.includes("fetch")) {
    return { type: APIErrors.NETWORK, message: "Network connection failed." };
  }

  if (err.message?.includes("Server error")) {
    return { type: APIErrors.SERVER, message: err.message };
  }

  return {
    type: APIErrors.UNKNOWN,
    message: err.message || "Unexpected error occurred.",
  };
}
