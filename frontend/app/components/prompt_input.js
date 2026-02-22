/**
 * Mirror of Tomorrow - Prompt Input Component
 * -------------------------------------------
 * Handles:
 *   - user text input
 *   - sending prompts to the backend
 *   - updating UI state (loading, output, errors)
 */

export default class PromptInput {
    constructor(uiState, apiClient) {
        this.uiState = uiState;
        this.apiClient = apiClient;

        // DOM references (to be connected in the main UI file)
        this.inputEl = null;
        this.buttonEl = null;
    }

    attach(inputElement, buttonElement) {
        this.inputEl = inputElement;
        this.buttonEl = buttonElement;

        this.buttonEl.addEventListener("click", () => this.submit());
        this.inputEl.addEventListener("keydown", (e) => {
            if (e.key === "Enter") this.submit();
        });
    }

    async submit() {
        const text = this.inputEl.value.trim();
        if (!text) return;

        this.uiState.setPrompt(text);
        this.uiState.setLoading(true);
        this.uiState.setError(null);

        try {
            const response = await this.apiClient.sendPrompt(text);
            this.uiState.setOutput(response);
        } catch (err) {
            this.uiState.setError("Unable to process request.");
        }

        this.uiState.setLoading(false);
    }
}
