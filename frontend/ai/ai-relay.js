// Sends the user's prompt to each AI window and collects their responses

export async function collectAIResponses(prompt) {
    const grokWindow = window.grokAI;
    const claudeWindow = window.claudeAI;
    const copilotWindow = window.copilotAI;

    const grokPromise = grokWindow.sendPrompt(prompt);
    const claudePromise = claudeWindow.sendPrompt(prompt);
    const copilotPromise = copilotWindow.sendPrompt(prompt);

    const [grok, claude, copilot] = await Promise.all([
        grokPromise,
        claudePromise,
        copilotPromise
    ]);

    return {
        type: "aiResponses",
        grok,
        claude,
        copilot
    };
}
