/**
 * Mirror of Tomorrow - Output Display Component
 * ---------------------------------------------
 * Renders the intelligence output returned from the backend.
 *
 * Displays:
 *   - summary
 *   - insights
 *   - emotional signal
 *   - trajectory
 *   - confidence/coherence/stability
 */

export default class OutputDisplay {
    constructor(uiState) {
        this.uiState = uiState;

        // DOM references (connected later)
        this.containerEl = null;
    }

    attach(containerElement) {
        this.containerEl = containerElement;
        this.render(); // initial empty render
    }

    render() {
        if (!this.containerEl) return;

        const output = this.uiState.output;
        const loading = this.uiState.loading;
        const error = this.uiState.error;

        // Loading state
        if (loading) {
            this.containerEl.innerHTML = `
                <div class="loading">
                    Processing...
                </div>
            `;
            return;
        }

        // Error state
        if (error) {
            this.containerEl.innerHTML = `
                <div class="error">
                    ${error}
                </div>
            `;
            return;
        }

        // No output yet
        if (!output) {
            this.containerEl.innerHTML = `
                <div class="placeholder">
                    Awaiting input...
                </div>
            `;
            return;
        }

        // Render intelligence output
        this.containerEl.innerHTML = `
            <div class="output-block">
                <h2>Summary</h2>
                <p>${output.summary}</p>

                <h3>Insights</h3>
                <ul>
                    ${output.insights.map(i => `<li>${i}</li>`).join("")}
                </ul>

                <h3>Signals</h3>
                <p><strong>Emotion:</strong> ${output.emotion}</p>
                <p><strong>Trajectory:</strong> ${output.trajectory}</p>
                <p><strong>Confidence:</strong> ${output.confidence}</p>
                <p><strong>Coherence:</strong> ${output.coherence}</p>
                <p><strong>Stability:</strong> ${output.stability}</p>
            </div>
        `;
    }
}
