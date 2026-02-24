class Consensus {
    compute(responses) {
        if (!Array.isArray(responses) || responses.length === 0) {
            return "";
        }

        // Basic deterministic consensus:
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
