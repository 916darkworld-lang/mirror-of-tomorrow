export class UIController {
    constructor() {
        this.summaryBox = document.getElementById("summaryBox");
        this.promptInput = document.getElementById("promptInput");
    }

    updateSummary(text) {
        if (this.summaryBox) {
            this.summaryBox.textContent = text;
        }
    }

    updatePrompt(text) {
        if (this.promptInput) {
            this.promptInput.value = text;
        }
    }

    showStatus(message) {
        console.log("[IAI Status]:", message);
    }
}
