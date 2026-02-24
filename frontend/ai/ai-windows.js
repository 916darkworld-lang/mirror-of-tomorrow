import { AIWindow } from "./ai-window.js";

/**
 * AI Windows Loader (Updated for Architecture A)
 * ----------------------------------------------
 * Responsibilities:
 *  - create iframe windows for each AI provider
 *  - attach AIWindow interface to each iframe
 *  - expose usable AI window objects for ai-relay.js
 */

class AIWindows {
    constructor() {
        this.windows = {};
        this.providers = [
            { id: "grok", url: "https://grok.com" },
            { id: "claude", url: "https://claude.ai" },
            { id: "copilot", url: "https://copilot.microsoft.com" }
        ];
    }

    loadAll() {
        console.log("Loading AI windows...");

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
            console.log(`${provider.id} window loaded`);

            // Attach AIWindow interface once iframe is ready
            const aiInterface = new AIWindow(frame.contentWindow);

            // Register globally so ai-relay.js can use it
            window[provider.id + "AI"] = aiInterface;

            this.windows[provider.id] = aiInterface;
        };

        document.getElementById("ai-grid").appendChild(frame);
    }

    /**
     * Returns the AIWindow interface objects
     * used by ai-relay.js
     */
    getInterfaces() {
        return this.windows;
    }
}

export default new AIWindows();
