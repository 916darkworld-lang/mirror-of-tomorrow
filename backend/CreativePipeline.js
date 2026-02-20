// backend/CreativePipeline.js

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

        const music = await this.generateMusic(context);
        const video = await this.generateVideo(context, music);
        const art = await this.generateArt(context, music, video);

        const final = this.buildFinalOutput({ prompt, music, video, art });

        return {
            output: final,
            components: { music, video, art },
            context
        };
    }

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

        return {
            type: 'simulated',
            tool: 'suno',
            result: `Simulated music track for: "${prompt}"`
        };
    }

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

        return {
            type: 'simulated',
            tool: 'runway',
            result: `Simulated video clip generated from music: "${music.result}"`
        };
    }

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

        return {
            type: 'simulated',
            tool: 'artModel',
            result: `Simulated cover art for: "${prompt}"`
        };
    }

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

    shouldUseRealTool(type) {
        if (this.mode === 'simulate') return false;
        if (this.mode === 'real') return true;
        return Boolean(this.tools[type]);
    }
}

module.exports = CreativePipeline;
