/**
 * AI Windows Loader
 * -----------------
 * Handles:
 *  - creating AI windows
 *  - loading each AI provider
 *  - injecting preload scripts
 *  - collecting responses
 */

class AIWindows {
    constructor() {
        this.windows = {};
        this.providers = [
            { id: "claude", url: "https://claude.ai" },
            { id: "gpt", url: "https://chat.openai.com" },
            { id: "gemini", url: "https://gemini.google.com" }
        ];
    }

    loadAll() {
        console.log("🪟 Loading AI windows...");

        this.providers.forEach(provider => {
            this.loadWindow(provider);
        });
    }

    loadWindow(provider) {
        const frame = document.createElement("iframe");
        frame.src = provider.url;
        frame.className = "ai-window";
        frame.dataset.ai = provider.id;

        frame.onload = () => {
            console.log(`🟢 ${provider.id} window loaded`);
        };

        document.getElementById("ai-grid").appendChild(frame);
        this.windows[provider.id] = frame;
    }

    /**
     * Extract text from each AI window.
     * (Placeholder — your real extraction logic goes here.)
     */
    async collectResponses(prompt) {
        return this.providers.map(p => ({
            ai: p.id,
            text: `${p.id} response to: ${prompt}`
        }));
    }
}

export default new AIWindows();
