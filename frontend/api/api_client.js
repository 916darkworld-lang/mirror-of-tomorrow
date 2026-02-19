/**
 * Mirror of Tomorrow - Frontend API Client
 * ----------------------------------------
 * This module handles communication between the frontend UI
 * and the backend intelligence router.
 *
 * It:
 *   - sends user input to the backend
 *   - receives the intelligence output
 *   - returns a clean JSON structure to the UI
 */

export default class APIClient {
    constructor(baseURL = "http://localhost:5000") {
        this.baseURL = baseURL;
    }

    async sendPrompt(text) {
        try {
            const response = await fetch(`${this.baseURL}/process`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ text })
            });

            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error("API Client Error:", error);

            // Placeholder fallback structure
            return {
                summary: "Unable to reach backend.",
                trajectory: "unknown",
                emotion: "neutral",
                insights: [],
                confidence: "low",
                coherence: "low",
                stability: "unstable",
                raw: {}
            };
        }
    }
}
