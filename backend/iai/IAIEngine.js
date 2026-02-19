/**
 * IAIEngine - The Prefrontal Cortex of the System
 * -----------------------------------------------
 * This is the decision-making brain that sits on top of:
 *
 *   - MemoryManager (brain tissue)
 *   - Multi-AI Orchestrator (external minds)
 *   - Creative Pipelines (music/video/art)
 *   - Chamber UI (reflection surface)
 *
 * Responsibilities:
 *   - Start and end sessions
 *   - Normalize inputs
 *   - Select tools/models
 *   - Apply strategic rules
 *   - Update memory after each run
 *   - Produce a final, stable decision/output
 *
 * This engine does NOT:
 *   - Render UI
 *   - Talk directly to external AI windows
 *   - Store raw transcripts or artifacts
 *
 * It ONLY:
 *   - Thinks
 *   - Decides
 *   - Learns
 */

import { MemoryManager } from "../memory/MemoryManager.js";

export default class IAIEngine {
    constructor({ localStorageAdapter, cloudStorageAdapter, secureLocalStorageAdapter }) {
        this.memory = new MemoryManager({
            localStorageAdapter,
            cloudStorageAdapter,
            secureLocalStorageAdapter
        });
    }

    /**
     * Start a new reasoning session.
     * Returns a sessionId that the orchestrator or pipeline will use.
     */
    startSession(initialData = {}) {
        const sessionId = `session_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        this.memory.sessionContext.startSession(sessionId, initialData);
        return sessionId;
    }

    /**
     * Update the session with new information.
     * This is where the orchestrator feeds:
     *   - tool outputs
     *   - alignment scores
     *   - metadata
     *   - partial results
     */
    updateSession(sessionId, partialData) {
        return this.memory.sessionContext.updateSession(sessionId, partialData);
    }

    /**
     * Core decision pipeline.
     * This is where the brain:
     *   - reads memory
     *   - applies rules
     *   - selects tools
     *   - produces a plan
     */
    async decide(sessionId) {
        const session = this.memory.sessionContext.getSession(sessionId);
        if (!session) {
            throw new Error(`Session ${sessionId} not found`);
        }

        const {
            user_id,
            task_type,
            input_prompt,
            metadata = {}
        } = session;

        // 1) Load user profile
        const profile = user_id
            ? await this.memory.userProfile.getProfile(user_id)
            : {};

        // 2) Load strategic rules
        const rules = await this.memory.strategicMemory.getAllRules();

        // 3) Apply rules to generate a plan
        const plan = this._generatePlan({
            task_type,
            input_prompt,
            metadata,
            profile,
            rules
        });

        // 4) Return the plan to the orchestrator or pipeline
        return plan;
    }

    /**
     * Internal rule application logic.
     * This is where the IAIEngine becomes intelligent.
     */
    _generatePlan({ task_type, input_prompt, metadata, profile, rules }) {
        const plan = {
            task_type,
            steps: [],
            recommended_tools: {},
            strategy_notes: []
        };

        // Apply strategic rules
        for (const rule of rules) {
            if (this._ruleApplies(rule, { task_type, metadata })) {
                plan.strategy_notes.push(rule.description);

                if (rule.recommends.preferred_tool) {
                    plan.recommended_tools[rule.applies_when.role] =
                        rule.recommends.preferred_tool;
                }

                // Example: visual tone, pacing, etc.
                Object.assign(plan, rule.recommends);
            }
        }

        // Apply user profile traits
        if (profile.visual_bias) {
            plan.strategy_notes.push(`User prefers visual bias: ${profile.visual_bias}`);
        }

        if (profile.preferred_video_tool) {
            plan.recommended_tools.video = profile.preferred_video_tool;
        }

        // Default fallback if no rules apply
        if (Object.keys(plan.recommended_tools).length === 0) {
            plan.recommended_tools = {
                music: "Suno",
                video: "Runway",
                art: "Midjourney"
            };
        }

        return plan;
    }

    /**
     * Check if a strategic rule applies to the current session.
     */
    _ruleApplies(rule, { task_type, metadata }) {
        const cond = rule.applies_when;

        if (cond.task_type && cond.task_type !== task_type) return false;

        if (cond.bpm_min && metadata.bpm && metadata.bpm < cond.bpm_min) return false;

        if (cond.mood && metadata.mood && metadata.mood !== cond.mood) return false;

        return true;
    }

    /**
     * End the session and distill memory.
     * This is where learning happens.
     */
    async completeSession(sessionId, finalSnapshot) {
        const session = this.memory.sessionContext.getSession(sessionId);
        if (!session) return;

        const sessionSnapshot = {
            ...session,
            ...finalSnapshot
        };

        // Distill into memory
        await this.memory.processCompletedSession(sessionSnapshot);

        // End session
        this.memory.sessionContext.endSession(sessionId);

        return { status: "completed", learned: true };
    }
}
