/**
 * MemoryManager - Core Brain Tissue for IAI
 * ----------------------------------------
 * Local-first, hybrid-capable memory architecture.
 *
 * Components:
 *  - SessionContextManager   (short-term working memory, local only)
 *  - EmotionalMemory         (deeply personal, local-only, encrypted if possible)
 *  - UserProfileManager      (identity traits, hybrid)
 *  - ToolPerformanceTracker  (tool stats, hybrid, anonymized)
 *  - StrategicMemoryStore    (playbook of learned rules, hybrid)
 *
 * This module does NOT:
 *  - store raw transcripts
 *  - store raw audio/video/images
 *  - hoard artifacts
 *
 * It ONLY stores:
 *  - traits
 *  - scores
 *  - rules
 *  - distilled patterns
 */

// Simple storage adapter interface expectation:
// storage.get(key) -> Promise<any>
// storage.set(key, value) -> Promise<void>

export class SessionContextManager {
    constructor() {
        this.sessions = new Map();
    }

    startSession(sessionId, initialData = {}) {
        this.sessions.set(sessionId, {
            ...initialData,
            created_at: Date.now(),
            updated_at: Date.now()
        });
    }

    updateSession(sessionId, partialData) {
        const existing = this.sessions.get(sessionId) || {};
        const updated = {
            ...existing,
            ...partialData,
            updated_at: Date.now()
        };
        this.sessions.set(sessionId, updated);
        return updated;
    }

    getSession(sessionId) {
        return this.sessions.get(sessionId) || null;
    }

    endSession(sessionId) {
        this.sessions.delete(sessionId);
    }
}

export class EmotionalMemory {
    constructor(localSecureStorage) {
        // localSecureStorage should be local-only, ideally encrypted
        this.storage = localSecureStorage;
        this.keyPrefix = "emotional_memory:";
    }

    _key(userId) {
        return `${this.keyPrefix}${userId}`;
    }

    async getState(userId) {
        const key = this._key(userId);
        const state = await this.storage.get(key);
        return state || {
            excitement_signals: [],
            disappointment_signals: [],
            last_updated: null
        };
    }

    async recordFeedback(userId, { excited = false, disappointed = false, tags = [] }) {
        const key = this._key(userId);
        const existing = await this.getState(userId);

        const excitement_signals = [...existing.excitement_signals];
        const disappointment_signals = [...existing.disappointment_signals];

        const entry = {
            at: Date.now(),
            tags
        };

        if (excited) excitement_signals.push(entry);
        if (disappointed) disappointment_signals.push(entry);

        const updated = {
            excitement_signals,
            disappointment_signals,
            last_updated: Date.now()
        };

        await this.storage.set(key, updated);
        return updated;
    }
}

export class UserProfileManager {
    constructor(storageAdapter) {
        this.storage = storageAdapter;
        this.keyPrefix = "user_profile:";
    }

    _key(userId) {
        return `${this.keyPrefix}${userId}`;
    }

    async getProfile(userId) {
        const profile = await this.storage.get(this._key(userId));
        return profile || {};
    }

    async updateProfile(userId, partialProfile) {
        const existing = await this.getProfile(userId);
        const updated = { ...existing, ...partialProfile, last_updated: Date.now() };
        await this.storage.set(this._key(userId), updated);
        return updated;
    }
}

export class ToolPerformanceTracker {
    constructor(storageAdapter) {
        this.storage = storageAdapter;
        this.keyPrefix = "tool_stats:";
    }

    _key(taskType) {
        return `${this.keyPrefix}${taskType}`;
    }

    /**
     * Record a single tool run result.
     * Personal identifiers should be stripped BEFORE this is called.
     */
    async recordResult({ taskType, toolName, alignmentScore, success, cost = null }) {
        const key = this._key(taskType);
        const existing = (await this.storage.get(key)) || {};

        const toolStats = existing[toolName] || {
            uses: 0,
            successes: 0,
            failures: 0,
            avg_alignment: 0,
            last_alignment: null,
            avg_cost: null
        };

        const uses = toolStats.uses + 1;
        const successes = toolStats.successes + (success ? 1 : 0);
        const failures = toolStats.failures + (success ? 0 : 1);
        const last_alignment = alignmentScore;

        const avg_alignment = toolStats.uses === 0
            ? alignmentScore
            : ((toolStats.avg_alignment * toolStats.uses) + alignmentScore) / uses;

        let avg_cost = toolStats.avg_cost;
        if (cost != null) {
            avg_cost = toolStats.uses === 0
                ? cost
                : ((toolStats.avg_cost * toolStats.uses) + cost) / uses;
        }

        const updatedToolStats = {
            uses,
            successes,
            failures,
            avg_alignment,
            last_alignment,
            avg_cost
        };

        const updated = {
            ...existing,
            [toolName]: updatedToolStats
        };

        await this.storage.set(key, updated);
        return updated;
    }

    async getBestToolForTask(taskType) {
        const key = this._key(taskType);
        const stats = (await this.storage.get(key)) || {};

        let bestTool = null;
        let bestScore = -Infinity;

        for (const [toolName, data] of Object.entries(stats)) {
            const successRate = data.uses > 0 ? data.successes / data.uses : 0;
            const score = (data.avg_alignment || 0) * 0.7 + successRate * 0.3;

            if (score > bestScore) {
                bestScore = score;
                bestTool = toolName;
            }
        }

        return bestTool;
    }
}

export class StrategicMemoryStore {
    constructor(storageAdapter) {
        this.storage = storageAdapter;
        this.rulesKey = "strategic_rules";
    }

    async getAllRules() {
        const rules = await this.storage.get(this.rulesKey);
        return rules || [];
    }

    async addOrUpdateRule(newRule) {
        const rules = await this.getAllRules();

        // Rule identity: by id or by (scope + condition_signature)
        const idx = rules.findIndex(r =>
            (newRule.id && r.id === newRule.id) ||
            (r.scope === newRule.scope && r.condition_signature === newRule.condition_signature)
        );

        if (idx >= 0) {
            rules[idx] = { ...rules[idx], ...newRule, updated_at: Date.now() };
        } else {
            rules.push({
                ...newRule,
                id: newRule.id || `rule_${Date.now()}_${Math.random().toString(16).slice(2)}`,
                created_at: Date.now(),
                updated_at: Date.now()
            });
        }

        await this.storage.set(this.rulesKey, rules);
        return rules;
    }

    /**
     * Distillation: turn raw session summary into strategic rules.
     *
     * sessionSnapshot is NOT a transcript.
     * It is a structured object like:
     *
     * {
     *   user_id: "michael",
     *   task_type: "music_video",
     *   bpm: 142,
     *   mood: "epic_dark",
     *   tools_used: [
     *     { name: "Suno", role: "music", success: true, alignment: 0.9 },
     *     { name: "Runway", role: "video", success: true, alignment: 0.88 }
     *   ],
     *   user_feedback: {
     *     satisfied: true,
     *     comments: "Loved the fast cuts with dark tones"
     *   }
     * }
     *
     * From this, we derive rules like:
     *  - "For music_video with bpm > 140, prefer fast cuts and darker tones."
     *  - "For music role in music_video, Suno has high alignment."
     */
    async distillFromSession(sessionSnapshot) {
        const rulesToAdd = [];

        const {
            task_type,
            bpm,
            mood,
            tools_used = [],
            user_feedback = {}
        } = sessionSnapshot;

        // Example: high BPM → fast cuts rule
        if (task_type === "music_video" && typeof bpm === "number" && bpm > 140 && user_feedback.satisfied) {
            rulesToAdd.push({
                scope: "pipeline_strategy",
                condition_signature: "music_video_bpm_gt_140",
                description: "For high BPM music videos, prefer fast cuts and more intense pacing.",
                applies_when: {
                    task_type: "music_video",
                    bpm_min: 140
                },
                recommends: {
                    video_editing_style: "fast_cuts",
                    pacing: "high_energy"
                }
            });
        }

        // Example: mood → visual tone rule
        if (task_type === "music_video" && mood && user_feedback.satisfied) {
            rulesToAdd.push({
                scope: "visual_style",
                condition_signature: `music_video_mood_${mood}`,
                description: `For ${mood} music videos, align visual tone with that mood.`,
                applies_when: {
                    task_type: "music_video",
                    mood
                },
                recommends: {
                    visual_tone: mood
                }
            });
        }

        // Example: tool performance → preference rule
        for (const tool of tools_used) {
            if (tool.success && tool.alignment >= 0.8) {
                rulesToAdd.push({
                    scope: "tool_preference",
                    condition_signature: `${task_type}_${tool.role}_${tool.name}`,
                    description: `For ${task_type} (${tool.role}), ${tool.name} has shown strong alignment.`,
                    applies_when: {
                        task_type,
                        role: tool.role
                    },
                    recommends: {
                        preferred_tool: tool.name
                    }
                });
            }
        }

        // Persist all derived rules
        const allRules = [];
        for (const rule of rulesToAdd) {
            const updated = await this.addOrUpdateRule(rule);
            // keep last snapshot of all rules
            allRules.splice(0, allRules.length, ...updated);
        }

        return allRules;
    }

    /**
     * For the "User is the Auditor" requirement:
     * Return rules in a human-readable form.
     */
    async getHumanReadableRules() {
        const rules = await this.getAllRules();
        return rules.map(r => ({
            id: r.id,
            description: r.description,
            applies_when: r.applies_when,
            recommends: r.recommends
        }));
    }
}

export class MemoryManager {
    /**
     * @param {object} options
     *  - localStorageAdapter: local-only structured storage
     *  - cloudStorageAdapter: optional, for syncable rules/stats
     *  - secureLocalStorageAdapter: for emotional memory
     */
    constructor({
        localStorageAdapter,
        cloudStorageAdapter = null,
        secureLocalStorageAdapter = null
    }) {
        // Local-first components
        this.sessionContext = new SessionContextManager();
        this.emotionalMemory = new EmotionalMemory(secureLocalStorageAdapter || localStorageAdapter);
        this.userProfile = new UserProfileManager(localStorageAdapter);
        this.toolPerformance = new ToolPerformanceTracker(localStorageAdapter);
        this.strategicMemory = new StrategicMemoryStore(localStorageAdapter);

        // Optional cloud adapters can be wired later for sync of:
        //  - anonymized tool stats
        //  - distilled strategic rules
        this.cloudStorage = cloudStorageAdapter;
    }

    /**
     * High-level helper: distill a session into strategic rules
     * and optionally update tool performance + profile.
     */
    async processCompletedSession(sessionSnapshot) {
        const {
            user_id,
            task_type,
            tools_used = [],
            user_feedback = {}
        } = sessionSnapshot;

        // 1) Update tool performance stats (local, anonymized)
        for (const tool of tools_used) {
            await this.toolPerformance.recordResult({
                taskType: task_type,
                toolName: tool.name,
                alignmentScore: tool.alignment ?? 0,
                success: !!tool.success,
                cost: tool.cost ?? null
            });
        }

        // 2) Emotional memory (local-only)
        if (user_id && (user_feedback.satisfied != null)) {
            await this.emotionalMemory.recordFeedback(user_id, {
                excited: !!user_feedback.satisfied,
                disappointed: user_feedback.satisfied === false,
                tags: user_feedback.tags || []
            });
        }

        // 3) Strategic rules (distillation)
        const rules = await this.strategicMemory.distillFromSession(sessionSnapshot);

        // 4) Optional: update profile traits (e.g., risk tolerance, style bias)
        if (user_id && user_feedback && user_feedback.satisfied != null) {
            const partialProfile = {};
            if (user_feedback.satisfied && task_type === "music_video") {
                partialProfile.prefers_music_video_pipelines = true;
            }
            if (Object.keys(partialProfile).length > 0) {
                await this.userProfile.updateProfile(user_id, partialProfile);
            }
        }

        return {
            rules,
            tool_stats_updated: true
        };
    }
}
