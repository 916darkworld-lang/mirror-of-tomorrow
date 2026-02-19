/**
 * multi_ai_orchestrator.js
 * -------------------------
 * This orchestrator manages the 5‑AI Brain Mode.
 *
 * Responsibilities:
 *   - Launch 5 AI windows (ChatGPT, Claude, Gemini, Copilot, Grok)
 *   - Broadcast the user prompt to all windows
 *   - Collect outputs from each AI
 *   - Normalize responses
 *   - Compute alignment scores
 *   - Build a sessionSnapshot for IAIEngine
 *   - Return the merged output
 *
 * This orchestrator does NOT:
 *   - Decide which tools to use (IAIEngine does that)
 *   - Store memory (MemoryManager does that)
 *   - Render UI (frontend handles that)
 */

import IAIEngine from "../iai/IAIEngine.js";

export default class MultiAIOrchestrator {
    constructor({ windowManager, localStorageAdapter, cloudStorageAdapter, secureLocalStorageAdapter }) {
        this.windowManager = windowManager; // abstraction for opening/controlling windows
        this.iai = new IAIEngine({
            localStorageAdapter,
            cloudStorageAdapter,
            secureLocalStorageAdapter
        });

        this.AI_SOURCES = [
            { name: "ChatGPT", url: "https://chat.openai.com" },
            { name: "Claude", url: "https://claude.ai" },
            { name: "Gemini", url: "https://gemini.google.com" },
            { name: "Copilot", url: "https://copilot.microsoft.com" },
            { name: "Grok", url: "https://x.ai" }
        ];
    }

    /**
     * Launch the 5 AI windows.
     */
    async launchWindows() {
        this.windows = {};

        for (const ai of this.AI_SOURCES) {
            this.windows[ai.name] = await this.windowManager.openWindow(ai.url, {
                title: ai.name,
                sandbox: true
            });
        }
    }

    /**
     * Broadcast a prompt to all 5 AIs.
     */
    async broadcastPrompt(prompt) {
        const results = [];

        for (const ai of this.AI_SOURCES) {
            const win = this.windows[ai.name];

            const output = await this.windowManager.sendPrompt(win, prompt);

            results.push({
                name: ai.name,
                output
            });
        }

        return results;
    }

    /**
     * Normalize AI outputs into a consistent structure.
     */
    normalizeOutputs(rawOutputs) {
        return rawOutputs.map(ai => ({
            name: ai.name,
            text: typeof ai.output === "string" ? ai.output : ai.output?.text || "",
            tokens: ai.output?.tokens || null,
            reasoning: ai.output?.reasoning || null
        }));
    }

    /**
     * Compute alignment scores between all 5 outputs.
     * Simple semantic similarity placeholder.
     */
    computeAlignment(normalized) {
        const scores = {};

        for (const a of normalized) {
            scores[a.name] = {};

            for (const b of normalized) {
                if (a.name === b.name) {
                    scores[a.name][b.name] = 1.0;
                } else {
                    scores[a.name][b.name] = this._semanticSimilarity(a.text, b.text);
                }
            }
        }

        return scores;
    }

    /**
     * Placeholder semantic similarity function.
     * Replace with embedding model later.
     */
    _semanticSimilarity(a, b) {
        if (!a || !b) return 0;
        const overlap = this._wordOverlap(a, b);
        return Math.min(1, overlap / 50);
    }

    _wordOverlap(a, b) {
        const setA = new Set(a.toLowerCase().split(/\W+/));
        const setB = new Set(b.toLowerCase().split(/\W+/));
        let count = 0;
        for (const word of setA) {
            if (setB.has(word)) count++;
        }
        return count;
    }

    /**
     * Build the session snapshot for IAIEngine + MemoryManager.
     */
    buildSessionSnapshot({ sessionId, user_id, prompt, normalized, alignment }) {
        return {
            session_id: sessionId,
            user_id,
            task_type: "multi_ai_brain",
            input_prompt: prompt,
            tools_used: normalized.map(ai => ({
                name: ai.name,
                role: "reasoning",
                success: true,
                alignment: this._averageAlignment(alignment[ai.name])
            })),
            metadata: {
                ai_count: normalized.length
            },
            user_feedback: {
                satisfied: null // filled later by UI
            }
        };
    }

    _averageAlignment(obj) {
        const vals = Object.values(obj);
        return vals.reduce((a, b) => a + b, 0) / vals.length;
    }

    /**
     * Main pipeline:
     *   - start session
     *   - broadcast prompt
     *   - normalize
     *   - compute alignment
     *   - ask IAIEngine to decide
     *   - return merged output
     */
    async run(prompt, user_id = null) {
        // 1) Start session
        const sessionId = this.iai.startSession({
            user_id,
            task_type: "multi_ai_brain",
            input_prompt: prompt
        });

        // 2) Launch windows if not already open
        if (!this.windows) {
            await this.launchWindows();
        }

        // 3) Broadcast prompt
        const rawOutputs = await this.broadcastPrompt(prompt);

        // 4) Normalize
        const normalized = this.normalizeOutputs(rawOutputs);

        // 5) Compute alignment
        const alignment = this.computeAlignment(normalized);

        // 6) Update session
        this.iai.updateSession(sessionId, {
            normalized_outputs: normalized,
            alignment_matrix: alignment
        });

        // 7) Ask IAIEngine to decide
        const plan = await this.iai.decide(sessionId);

        // 8) Build session snapshot
        const snapshot = this.buildSessionSnapshot({
            sessionId,
            user_id,
            prompt,
            normalized,
            alignment
        });

        // 9) Complete session (learning)
        await this.iai.completeSession(sessionId, snapshot);

        // 10) Merge outputs (simple version)
        const merged = this._mergeOutputs(normalized, alignment);

        return {
            merged_output: merged,
            plan,
            alignment,
            raw_outputs: normalized
        };
    }

    /**
     * Simple merging strategy:
     *   - pick the AI with highest average alignment
     *   - future: weighted fusion
     */
    _mergeOutputs(normalized, alignment) {
        let bestAI = null;
        let bestScore = -Infinity;

        for (const ai of normalized) {
            const avg = this._averageAlignment(alignment[ai.name]);
            if (avg > bestScore) {
                bestScore = avg;
                bestAI = ai;
            }
        }

        return bestAI?.text || "";
    }
}
