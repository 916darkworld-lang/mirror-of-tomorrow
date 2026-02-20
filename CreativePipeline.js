// backend/CreativePipeline.js

/**
 * CreativePipeline
 * -----------------
 * This module handles the creative workflow:
 * Music → Video → Art → Final Output
 *
 * It supports:
 *  - simulate mode (no external tools)
 *  - real mode (external tools only)
 *  - hybrid mode (real tools when available, fallback to simulated)
 *
 * It logs performance to the SQLite Ledger
 * and reads preferences from the JSON Vault.
 */

class CreativePipeline {
    constructor({ memory, mode = 'hybrid', tools = {} }) {
        this.memory = memory;
        this.mode = mode; // simulate | real | hybrid
        this.tools = tools; // { suno, runway, artModel }
    }

    async run({ prompt, traits = {}, meta = {} }) {
        const context = {
            prompt,
            traits,
            meta,
            timestamp: new Date().toISOString()
        };

        // 1. MUSIC
        const music = await this.generateMusic(context);

        // 2. VIDEO
        const video = await this.generateVideo(context, music);

        // 3. ART
        const art = await this.generateArt(context, music, video);

        // 4. FINAL OUTPUT
        const final = this.buildFinalOutput({ prompt, music, video, art });

        return {
            output: final,
            components: { music, video, art },
            context
        };
    }

    // -----------------------------
    // MUSIC
    // -----------------------------
    async generateMusic(context) {
        const { prompt } = context;

        if (this.shouldUseRealTool('music')) {
            try {
                const result = await this.tools.suno.generate({ prompt });
                this.memory.logToolPerformance('suno', 'music', 9);
                return { type: 'real', tool: 'suno', result };
            } catch (err) {
                this.memory.logToolPerformance('suno', 'music', 3);
            }
        }

        // fallback simulation
        return {
            type: 'simulated',
            tool: 'suno',
            result: `Simulated music track for: "${prompt}"`
        };
    }

    // -----------------------------
    // VIDEO
    // -----------------------------
    async generateVideo(context, music) {
        const { prompt } = context;

        if (this.shouldUseRealTool('video')) {
            try {
                const result = await this.tools.runway.generate({
                    prompt,
                    musicTrack: music.result
                });
                this.memory.logToolPerformance('runway', 'video', 9);
                return { type: 'real', tool: 'runway', result };
            } catch (err) {
                this.memory.logToolPerformance('runway', 'video', 3);
            }
        }

        // fallback simulation
        return {
            type: 'simulated',
            tool: 'runway',
            result: `Simulated video clip generated from music: "${music.result}"`
        };
    }

    // -----------------------------
    // ART
    // -----------------------------
    async generateArt(context, music, video) {
        const { prompt } = context;

        if (this.shouldUseRealTool('art')) {
            try {
                const result = await this.tools.artModel.generate({
                    prompt,
                    videoPreview: video.result
                });
                this.memory.logToolPerformance('artModel', 'art', 9);
                return { type: 'real', tool: 'artModel', result };
            } catch (err) {
                this.memory.logToolPerformance('artModel', 'art', 3);
            }
        }

        // fallback simulation
        return {
            type: 'simulated',
            tool: 'artModel',
            result: `Simulated cover art for: "${prompt}"`
        };
    }

    // -----------------------------
    // FINAL OUTPUT
    // -----------------------------
    buildFinalOutput({ prompt, music, video, art }) {
        return `
Creative Pipeline Output
------------------------
Prompt: ${prompt}

Music:  [${music.type}] from ${music.tool}
${music.result}

Video:  [${video.type}] from ${video.tool}
${video.result}

Art:    [${art.type}] from ${art.tool}
${art.result}
        `.trim();
    }

    // -----------------------------
    // ROUTING LOGIC
    // -----------------------------
    shouldUseRealTool(type) {
        if (this.mode === 'simulate') return false;
        if (this.mode === 'real') return true;

        // hybrid mode
        return Boolean(this.tools[type]);
    }
}

module.exports = CreativePipeline;
