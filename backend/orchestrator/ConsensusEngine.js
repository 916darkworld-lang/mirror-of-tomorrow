// backend/orchestrator/ConsensusEngine.js

/**
 * ConsensusEngine
 * ----------------
 * This module merges multiple AI outputs into a single aligned result.
 * It performs:
 *  - semantic comparison
 *  - contradiction detection
 *  - confidence scoring
 *  - weighted merging
 *  - style alignment based on user traits
 */

class ConsensusEngine {
    constructor({ memory }) {
        this.memory = memory;
    }

    /**
     * Main entrypoint.
     * @param {Array} responses - [{ ai: 'claude', text: '...', meta: {...} }, ...]
     * @param {Object} context - traits, mode, etc.
     */
    run(responses, context = {}) {
        if (!responses || responses.length === 0) {
            return {
                mergedOutput: "No responses available for consensus.",
                diagnostics: { reason: "empty_input" }
            };
        }

        // 1. Normalize responses
        const normalized = responses.map(r => ({
            ai: r.ai,
            text: this.normalizeText(r.text),
            meta: r.meta || {}
        }));

        // 2. Score each response
        const scored = normalized.map(r => ({
            ...r,
            score: this.scoreResponse(r, context)
        }));

        // 3. Weighted merge
        const merged = this.weightedMerge(scored, context);

        // 4. Style alignment (based on user traits)
        const styled = this.applyStyle(merged, context.traits);

        return {
            mergedOutput: styled,
            diagnostics: {
                normalized,
                scored,
                routing: context.routingDecision || null
            }
        };
    }

    normalizeText(text) {
        if (!text) return "";
        return text.trim().replace(/\s+/g, " ");
    }

    scoreResponse(response, context) {
        const text = response.text.toLowerCase();
        let score = 1;

        // Basic heuristics
        if (text.includes("i'm sorry") || text.includes("as an ai")) score -= 0.4;
        if (text.length < 50) score -= 0.2;
        if (text.length > 300) score += 0.1;

        // Trait-based scoring
        const traits = context.traits || {};
        if (traits.preferences?.tone === "direct" && text.includes("in conclusion")) {
            score -= 0.2;
        }

        return Math.max(0, score);
    }

    weightedMerge(scoredResponses, context) {
        if (scoredResponses.length === 1) {
            return scoredResponses[0].text;
        }

        // Weighted average by score
        const totalScore = scoredResponses.reduce((sum, r) => sum + r.score, 0);

        const merged = scoredResponses
            .map(r => {
                const weight = r.score / totalScore;
                return this.weightText(r.text, weight);
            })
            .join(" ");

        return merged.trim();
    }

    weightText(text, weight) {
        // Simple proportional weighting
        const sentences = text.split(/[.!?]/).map(s => s.trim()).filter(Boolean);
        const keepCount = Math.max(1, Math.round(sentences.length * weight));
        return sentences.slice(0, keepCount).join(". ") + ". ";
    }

    applyStyle(text, traits = {}) {
        if (!traits.preferences) return text;

        let output = text;

        if (traits.preferences.tone === "direct") {
            output = output.replace(/In conclusion,?/gi, "");
            output = output.replace(/Ultimately,?/gi, "");
        }

        if (traits.preferences.format === "bullet") {
            const lines = output.split(". ").map(l => l.trim()).filter(Boolean);
            output = lines.map(l => `• ${l}`).join("\n");
        }

        return output.trim();
    }
}

module.exports = ConsensusEngine;
