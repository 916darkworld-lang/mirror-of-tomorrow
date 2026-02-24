import Consensus from "./consensus.js";

class Orchestrator {
    async processPrompt({ grokResponse, claudeResponse, copilotResponse }) {
        // Run deterministic consensus
        const final = Consensus.compute({
            grokResponse,
            claudeResponse,
            copilotResponse
        });

        // Basic summary for the user-facing prompt box
        const summary = `Summary:\n\nGrok: ${grokResponse}\n\nClaude: ${claudeResponse}\n\nCopilot: ${copilotResponse}\n\nConsensus: ${final}`;

        // Loop state for the next round of AI-to-AI swaps
        const loopState = {
            nextForGrok: claudeResponse,
            nextForClaude: copilotResponse,
            nextForCopilot: grokResponse
        };

        return {
            grokResponse,
            claudeResponse,
            copilotResponse,
            final,
            summary,
            loopState
        };
    }
}

export default new Orchestrator();
