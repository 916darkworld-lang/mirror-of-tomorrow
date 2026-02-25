// frontend/app/controllers/app_controller.js

/**
 * AppController
 *
 * The central coordinator for:
 *  - PromptInput
 *  - OutputView
 *  - AIControls
 *  - AIGrid
 *  - AppState
 *
 * This file contains the actual logic for:
 *  - sending prompts
 *  - mixing outputs
 *  - advancing steps
 *  - triggering chamber mode
 */

import appState from "../state/app_state";
import PromptInput from "../components/prompt_input";
import OutputView from "../components/output_view";
import AIControls from "../components/ai_controls";
import AIGrid from "../components/ai_grid";

class AppController {
  constructor(config) {
    /**
     * config = {
     *   promptSelector,
     *   outputSelector,
     *   controls: {
     *     sendSelector,
     *     nextSelector,
     *     mixSelector,
     *     chamberSelector
     *   },
     *   aiGrid: {
     *     slots: [...]
     *   }
     * }
     */

    this.promptInput = new PromptInput(
      config.promptSelector,
      (value) => this.handleSend(value)
    );

    this.outputView = new OutputView(config.outputSelector);

    this.aiGrid = new AIGrid(config.aiGrid);

    this.controls = new AIControls({
      sendSelector: config.controls.sendSelector,
      nextSelector: config.controls.nextSelector,
      mixSelector: config.controls.mixSelector,
      chamberSelector: config.controls.chamberSelector,
      onSend: () => this.handleSend(appState.prompt.get()),
      onNext: () => this.handleNext(),
      onMix: () => this.handleMix(),
      onChamber: () => this.handleChamber(),
    });
  }

  async handleSend(prompt) {
    if (!prompt) return;

    appState.loading.start();
    appState.output.clear();
    appState.error.clear();

    try {
      // Save prompt into state
      appState.prompt.set(prompt);

      // Call your IAI backend
      const response = await fetch("/api/iai/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`IAI backend error: ${response.status}`);
      }

      const data = await response.json();

      // Expecting something like: { output: "text", meta: {...} }
      const aiOutput = data.output || "No response from IAI engine.";

      appState.output.set(aiOutput);
      appState.history.add(prompt, aiOutput);
    } catch (err) {
      console.error("IAI handleSend error:", err);
      appState.error.set("There was a problem talking to the IAI engine.");
    } finally {
      appState.loading.stop();
    }
  }

  handleNext() {
    const nextText = "Next step triggered.";
    appState.output.set(nextText);
    appState.history.add("(next)", nextText);
  }

  handleMix() {
    const mixed = "Mixed output from all AIs.";
    appState.output.set(mixed);
    appState.history.add("(mix)", mixed);
  }

  handleChamber() {
    appState.chamber.start(appState.prompt.get());

    setTimeout(() => {
      const chamberOutput = "Chamber processed the prompt.";
      appState.chamber.finish(chamberOutput);
      appState.output.set(chamberOutput);
      appState.history.add("(chamber)", chamberOutput);
    }, 500);
  }
}

export default AppController;
