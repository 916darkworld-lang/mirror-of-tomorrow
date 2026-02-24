class Consensus {
    compute({ grokResponse, claudeResponse, copilotResponse }) {
        const responses = [
            grokResponse,
            claudeResponse,
            copilotResponse
        ].filter(r => typeof r === "string" && r.length > 0);

        if (responses.length === 0) {
            return "";
        }

        // Deterministic consensus:
        // Choose the response with the most characters.
        let longest = responses[0];

        for (let i = 1; i < responses.length; i++) {
            if (responses[i].length > longest.length) {
                longest = responses[i];
            }
        }

        return longest;
    }
}

export default new Consensus();
