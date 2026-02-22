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

  handleSend(prompt) {
    if (!prompt) return;

    appState.loading.start();
    appState.output.clear();
    appState.error.clear();

    // In your real system, this is where you'd orchestrate AI calls.
    // For now, we simulate output.
    setTimeout(() => {
      const fakeOutput = `AI Response to: ${prompt}`;
      appState.output.set(fakeOutput);
      appState.history.add(prompt, fakeOutput);
      appState.loading.stop();
    }, 300);
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
