/**
 * Preload Script
 * --------------
 * Injected into each AI iframe to extract visible text.
 * This is a placeholder — replace selectors with real ones
 * once you inspect each AI provider's DOM.
 */

class PreloadExtractor {
    constructor() {
        this.last = "";
    }

    /**
     * Extract visible text from the AI window.
     * Replace the selector with the real chat container.
     */
    extract() {
        try {
            const root = document.querySelector("body");
            if (!root) return "";

            const text = root.innerText || "";
            this.last = text;
            return text;
        } catch (err) {
            console.error("Extractor error:", err);
            return this.last;
        }
    }
}

window.__AI_EXTRACTOR__ = new PreloadExtractor();
