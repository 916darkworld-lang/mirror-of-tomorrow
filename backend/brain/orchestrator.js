import AI1 from "./models/ai1.js";
import AI2 from "./models/ai2.js";
import AI3 from "./models/ai3.js";
import Consensus from "./consensus.js";

class Orchestrator {
    async processPrompt(prompt) {
        const responses = await Promise.all([
            AI1.ask(prompt),
            AI2.ask(prompt),
            AI3.ask(prompt)
        ]);

        const final = Consensus.compute(responses);

        return {
            responses,
            final
        };
    }
}

export default new Orchestrator();
