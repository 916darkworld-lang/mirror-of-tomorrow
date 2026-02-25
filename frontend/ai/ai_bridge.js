/**
 * frontend/ai/ai_bridge.js
 */

class AIBridge {
  constructor() {
    this.ws = null;
    this.grokWindow = null;
    this.claudeWindow = null;
    this.copilotWindow = null;

    this.connectBrain();
    this.listenForAIWindows();
  }

  connectBrain() {
    this.ws = new WebSocket("ws://localhost:8080");

    this.ws.onopen = () => {
      console.log("AIBridge connected to Brain");
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "finalOutput") {
        window.dispatchEvent(
          new CustomEvent("iai-final-output", { detail: data.output })
        );
      }
    };

    this.ws.onerror = (err) => {
      console.error("Brain WebSocket error:", err);
    };

    this.ws.onclose = () => {
      console.warn("Brain disconnected, retrying...");
      setTimeout(() => this.connectBrain(), 1000);
    };
  }

  openAIWindows() {
    this.grokWindow = window.open("/ai/grok.html", "grok");
    this.claudeWindow = window.open("/ai/claude.html", "claude");
    this.copilotWindow = window.open("/ai/copilot.html", "copilot");
  }

  listenForAIWindows() {
    window.addEventListener("message", (event) => {
      const data = event.data;

      if (
        data.type === "grokResponse" ||
        data.type === "claudeResponse" ||
        data.type === "copilotResponse"
      ) {
        this.ws.send(
          JSON.stringify({
            type: "aiResponse",
            grokResponse: data.grokResponse,
            claudeResponse: data.claudeResponse,
            copilotResponse: data.copilotResponse,
          })
        );
      }
    });
  }

  sendPromptToAIs(prompt) {
    if (this.grokWindow) {
      this.grokWindow.postMessage({ type: "prompt", prompt }, "*");
    }
    if (this.claudeWindow) {
      this.claudeWindow.postMessage({ type: "prompt", prompt }, "*");
    }
    if (this.copilotWindow) {
      this.copilotWindow.postMessage({ type: "prompt", prompt }, "*");
    }
  }
}

export default new AIBridge();
