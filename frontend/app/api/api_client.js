// frontend/app/api/api_client.js

/**
 * APIClient
 *
 * Handles all network requests for the Mirror of Tomorrow frontend.
 * Provides:
 *  - sendPrompt(prompt)
 */

class APIClient {
  constructor(baseURL = "/api") {
    this.baseURL = baseURL;
  }

  async sendPrompt(prompt) {
    try {
      const response = await fetch(`${this.baseURL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      return data?.output ?? "";
    } catch (err) {
      console.error("APIClient.sendPrompt error:", err);
      throw err;
    }
  }
}

export default APIClient;
