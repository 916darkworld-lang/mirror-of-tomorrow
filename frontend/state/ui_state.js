/**
 * Mirror of Tomorrow - UI State Manager
 * -------------------------------------
 * Centralized state container for the frontend.
 *
 * Tracks:
 *   - user prompt
 *   - AI output
 *   - loading state
 *   - error state
 *   - UI transitions
 */

export default class UIState {
    constructor() {
        this.prompt = "";
        this.output = null;
        this.loading = false;
        this.error = null;

        // Future expansion:
        // - animation states
        // - chamber mode
        // - hologram intensity
        // - multi-panel transitions
    }

    setPrompt(text) {
        this.prompt = text;
    }

    setLoading(isLoading) {
        this.loading = isLoading;
    }

    setOutput(data) {
        this.output = data;
    }

    setError(message) {
        this.error = message;
    }

    reset() {
        this.prompt = "";
        this.output = null;
        this.loading = false;
        this.error = null;
    }
}
