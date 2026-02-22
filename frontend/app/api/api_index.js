// frontend/app/api/api_index.js

/**
 * API Index
 *
 * This file exposes the API layer used by the frontend.
 * It allows switching between:
 *  - APIClient (real backend)
 *  - APIMock (offline mode)
 */

import APIClient from "./api_client";
import APIMock from "./api_mock";

const USE_MOCK = false; // set true for offline testing

const api = USE_MOCK ? new APIMock() : new APIClient();

export default api;
