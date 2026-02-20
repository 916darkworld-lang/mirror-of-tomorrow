class SunoAdapter {
    constructor() {}

    async generateMusic(prompt) {
        return {
            success: true,
            result: `Music generated from prompt: "${prompt}"`
        };
    }
}

module.exports = SunoAdapter;
