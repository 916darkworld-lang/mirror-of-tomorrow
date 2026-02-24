import Consensus from "./consensus.js";

class Orchestrator {
    async processPrompt({ grokResponse, claudeResponse, copilotResponse }) {
        // Run deterministic consensus
        const final = Consensus.compute({
            grokResponse,
            claudeResponse,
            copilotResponse
        });

        // Summary for user-facing prompt box
        const summary =
            `Summary:\n\n` +
            `Grok: ${grokResponse}\n\n` +
            `Claude: ${claudeResponse}\n\n` +
            `Copilot: ${copilotResponse}\n\n` +
            `Consensus: ${final}`;

        // Loop state for next round of AI-to-AI swaps
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
