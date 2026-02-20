const ConsensusEngine = require('./ConsensusEngine');

class MultiAIOrchestrator {
    constructor({ memory }) {
        this.memory = memory;
        this.consensus = new ConsensusEngine({ memory });
    }

    async run({ prompt, context, routingDecision }) {
        // Simulated 5‑AI responses for now
        const responses = [
            { ai: "claude", text: `Claude's take on: ${prompt}` },
            { ai: "gpt", text: `GPT's interpretation: ${prompt}` },
            { ai: "grok", text: `Grok's angle: ${prompt}` },
            { ai: "gemini", text: `Gemini's view: ${prompt}` },
            { ai: "copilot", text: `Copilot's reasoning: ${prompt}` }
        ];

        const consensus = this.consensus.run(responses, {
            ...context,
            routingDecision
        });

        return {
            mergedOutput: consensus.mergedOutput,
            diagnostics: consensus.diagnostics
        };
    }
}

module.exports = MultiAIOrchestrator;
