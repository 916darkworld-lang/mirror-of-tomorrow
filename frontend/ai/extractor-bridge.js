/**
 * Extractor Bridge
 * ----------------
 * Calls the extractor INSIDE each AI iframe from the parent window.
 * This is how the orchestrator gets real text from each AI window.
 */

class ExtractorBridge {
    constructor() {
        this.frames = [];
    }

    registerFrames() {
        this.frames = Array.from(document.querySelectorAll("iframe.ai-window"));
    }

    /**
     * Calls the preload extractor inside each iframe.
     * Returns: [{ ai: 'claude', text: '...' }, ...]
     */
    collectAll() {
        const results = [];

        this.frames.forEach(frame => {
            try {
                const ai = frame.dataset.ai;
                const extractor = frame.contentWindow.__AI_EXTRACTOR__;

                if (!extractor) {
                    results.push({ ai, text: "" });
                    return;
                }

                const text = extractor.extract();
                results.push({ ai, text });
            } catch (err) {
                results.push({ ai: frame.dataset.ai, text: "" });
            }
        });

        return results;
    }
}

export default new ExtractorBridge();
