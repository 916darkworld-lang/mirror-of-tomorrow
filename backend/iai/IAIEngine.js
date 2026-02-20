// backend/IAIEngine.js
const MultiAIOrchestrator = require('./orchestrator/multiaiorchestrator');
const MemoryManager = require('./MemoryManager');

class IAIEngine {
    constructor(options = {}) {
        const { userDataPath = './data', mode = 'hybrid' } = options;

        this.mode = mode; // 'simulate' | 'real' | 'hybrid'
        this.memory = new MemoryManager(userDataPath);
        this.orchestrator = new MultiAIOrchestrator({
            memory: this.memory
        });

        // Placeholder for real tool clients (Suno, Runway, etc.)
        this.tools = {
            // suno: new SunoClient({ apiKey: process.env.SUNO_KEY }),
            // runway: new RunwayClient({ apiKey: process.env.RUNWAY_KEY }),
        };
    }

    /**
     * Main thinking entrypoint.
     * @param {Object} payload
     * @param {string} payload.prompt
     * @param {string} [payload.mode] - e.g. 'chamber', 'multi_ai', 'creative'
     * @param {Object} [payload.meta] - extra flags/context
     */
    async think({ prompt, mode = 'chamber', meta = {} }) {
        const traits = this.memory.getTraits();

        // 1. Build context
        const context = {
            traits,
            mode,
            meta,
            timestamp: new Date().toISOString()
        };

        // 2. Decide routing strategy
        const routingDecision = this.decideRouting({ prompt, mode, traits });

        // 3. Run through orchestrator (internal 5‑AI brain)
        const orchestratorResult = await this.orchestrator.run({
            prompt,
            context,
            routingDecision
        });

        // 4. Optionally call real tools (if in 'real' or 'hybrid' and routing says so)
        let externalResults = null;
        if (this.shouldUseExternalTools(routingDecision)) {
            externalResults = await this.runExternalTools({
                prompt,
                mode,
                traits,
                routingDecision
            });
        }

        // 5. Merge internal + external into final answer
        const merged = this.mergeResults({
            prompt,
            mode,
            traits,
            orchestratorResult,
            externalResults
        });

        // 6. Log performance / learning hooks
        this.learnFromOutcome({
            prompt,
            mode,
            traits,
            routingDecision,
            orchestratorResult,
            externalResults,
            merged
        });

        return {
            output: merged.output,
            reasoning: {
                routingDecision,
                orchestratorResult,
                externalResultsSummary: externalResults
                    ? this.summarizeExternal(externalResults)
                    : null,
                traitsUsed: traits
            }
        };
    }

    decideRouting({ prompt, mode, traits }) {
        // Very simple starter logic; expand later.
        const lower = prompt.toLowerCase();

        const isMusic =
            lower.includes('song') ||
            lower.includes('music') ||
            lower.includes('melody');

        const isVideo =
            lower.includes('video') ||
            lower.includes('clip') ||
            lower.includes('scene');

        const isArt =
            lower.includes('image') ||
            lower.includes('art') ||
            lower.includes('cover');

        return {
            useInternalConsensus: true,
            useExternalMusic: isMusic,
            useExternalVideo: isVideo,
            useExternalArt: isArt,
            mode
        };
    }

    shouldUseExternalTools(routingDecision) {
        if (this.mode === 'simulate') return false;
        if (this.mode === 'real') return true;
        // hybrid
        return (
            routingDecision.useExternalMusic ||
            routingDecision.useExternalVideo ||
            routingDecision.useExternalArt
        );
    }

    async runExternalTools({ prompt, mode, traits, routingDecision }) {
        const results = {};

        // NOTE: these are placeholders; wire real clients later.
        if (routingDecision.useExternalMusic) {
            results.music = {
                tool: 'suno',
                status: 'simulated',
                note: 'Hook real Suno client here.'
            };
            this.memory.logToolPerformance('suno', 'music', 8);
        }

        if (routingDecision.useExternalVideo) {
            results.video = {
                tool: 'runway',
                status: 'simulated',
                note: 'Hook real Runway client here.'
            };
            this.memory.logToolPerformance('runway', 'video', 8);
        }

        if (routingDecision.useExternalArt) {
            results.art = {
                tool: 'image_model',
                status: 'simulated',
                note: 'Hook real art model here.'
            };
            this.memory.logToolPerformance('image_model', 'art', 8);
        }

        return results;
    }

    mergeResults({ prompt, mode, traits, orchestratorResult, externalResults }) {
        // For now, just surface orchestrator output and annotate with external info.
        const externalSummary = externalResults
            ? Object.keys(externalResults).map(k => `${k}: ${externalResults[k].status}`).join(', ')
            : 'none';

        const baseOutput =
            orchestratorResult?.mergedOutput ||
            orchestratorResult?.output ||
            'No orchestrator output available.';

        const decorated = `${baseOutput}\n\n[External tools used: ${externalSummary}]`;

        return {
            output: decorated,
            meta: {
                mode,
                traitsSnapshot: traits
            }
        };
    }

    learnFromOutcome({
        prompt,
        mode,
        traits,
        routingDecision,
        orchestratorResult,
        externalResults,
        merged
    }) {
        // Hook for future: update identity, rules, stats based on feedback.
        // Example: if meta.feedbackScore exists, log it.
        // This is intentionally minimal for now.
        return;
    }

    summarizeExternal(externalResults) {
        const summary = {};
        for (const [k, v] of Object.entries(externalResults)) {
            summary[k] = {
                tool: v.tool,
                status: v.status
            };
        }
        return summary;
    }
}

module.exports = IAIEngine;
