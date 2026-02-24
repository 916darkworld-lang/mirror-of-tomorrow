/**
 * AI Window Manager
 * -----------------
 * Coordinates:
 *  - extraction timing
 *  - calling extractor-bridge
 *  - sending results to orchestrator
 */

import ExtractorBridge from "./extractor-bridge.js";

class WindowManager {
    constructor() {
        this.interval = null;
        this.callback = null;
    }

    /**
     * Start polling AI windows for responses.
     * @param {Function} onCollect - callback(responses)
     */
    start(onCollect) {
        this.callback = onCollect;

        // Register frames once
        ExtractorBridge.registerFrames();

        // Poll every 1.5 seconds
        this.interval = setInterval(() => {
            const responses = ExtractorBridge.collectAll();
            if (this.callback) this.callback(responses);
        }, 1500);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

export default new WindowManager();
