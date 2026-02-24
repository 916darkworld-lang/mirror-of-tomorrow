import { collectAIResponses } from "../ai/ai-relay.js";

export class LoopController {
    constructor(brainSocket, ui) {
        this.brainSocket = brainSocket;
        this.ui = ui;

        this.pendingResolve = null;

        this.brainSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "brainResponse") {
                if (this.pendingResolve) {
                    this.pendingResolve(data.result);
                    this.pendingResolve = null;
                }
            }
        };
    }

    sendToBrain(payload) {
        this.brainSocket.send(JSON.stringify(payload));
    }

    waitForBrain() {
        return new Promise((resolve) => {
            this.pendingResolve = resolve;
        });
    }

    async runInitial(prompt) {
        // Step 1: Send prompt to all AI windows
        const aiResponses = await collectAIResponses(prompt);

        // Step 2: Send AI responses to backend
        this.sendToBrain(aiResponses);

        // Step 3: Wait for backend result
        const result = await this.waitForBrain();

        // Step 4: Update UI with summary
        this.ui.updateSummary(result.summary);

        return result;
    }

    async runLoop(result) {
        const loopState = result.loopState;

        // Step 5: Send swapped responses to AI windows
        const aiResponses = await collectAIResponses({
            grok: loopState.nextForGrok,
            claude: loopState.nextForClaude,
            copilot: loopState.nextForCopilot
        });

        // Step 6: Send updated responses to backend
        this.sendToBrain(aiResponses);

        // Step 7: Wait for backend result
        const nextResult = await this.waitForBrain();

        // Step 8: Update UI with new summary
        this.ui.updateSummary
