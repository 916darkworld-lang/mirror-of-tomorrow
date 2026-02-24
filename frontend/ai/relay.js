/**
 * AI Relay
 * --------
 * Sends collected AI window responses to the backend brain.
 */

import bridge from "../bridge/bridge-connection.js";
import WindowManager from "./window-manager.js";

class AIRelay {
    constructor() {
        this.active = false;
    }

    /**
     * Start collecting AI responses and relaying them to the brain.
     */
    start() {
        if (this.active) return;
        this.active = true;

        WindowManager.start((responses) => {
            this.sendToBrain(responses);
        });
    }

    stop() {
        this.active = false;
        WindowManager.stop();
    }

    sendToBrain(responses) {
        bridge.ws.send(JSON.stringify({
            type: "aiResponses",
            responses
        }));
    }
}

export default new AIRelay();
