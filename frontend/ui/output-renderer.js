/**
 * Output Renderer
 * ---------------
 * Displays the final consensus result in the UI.
 */

class OutputRenderer {
    constructor() {
        this.outputEl = null;
    }

    init() {
        this.outputEl = document.getElementById("output");
    }

    render(text) {
        if (!this.outputEl) return;
        this.outputEl.innerText = text;
    }

    append(text) {
        if (!this.outputEl) return;
        this.outputEl.innerText += "\n" + text;
    }

    clear() {
        if (!this.outputEl) return;
        this.outputEl.innerText = "";
    }
}

export default new OutputRenderer();
