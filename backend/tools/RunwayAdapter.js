class RunwayAdapter {
    constructor() {}

    async generateVideo(prompt) {
        return {
            success: true,
            result: `Video generated from prompt: "${prompt}"`
        };
    }
}

module.exports = RunwayAdapter;
