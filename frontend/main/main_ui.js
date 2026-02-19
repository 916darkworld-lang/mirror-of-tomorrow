/**
 * Mirror of Tomorrow - Main UI Assembly
 * -------------------------------------
 * This file wires together:
 *   - UIState
 *   - APIClient
 *   - PromptInput
 *   - OutputDisplay
 *   - ChamberCore
 *
 * It attaches components to the DOM and manages reactive updates.
 */

import UIState from "../state/ui_state.js";
import APIClient from "../api/api_client.js";
import PromptInput from "../components/prompt_input.js";
import OutputDisplay from "../components/output_display.js";
import ChamberCore from "../components/chamber_core.js";

export default class MainUI {
    constructor() {
        // Core systems
        this.uiState = new UIState();
        this.apiClient = new APIClient();

        // Components
        this.promptInput = new PromptInput(this.uiState, this.apiClient);
        this.outputDisplay = new OutputDisplay(this.uiState);
        this.chamberCore = new ChamberCore(this.uiState);

        // DOM references (connected in init())
        this.dom = {
            input: null,
            button: null,
            output: null,
            chamber: null
        };
    }

    init() {
        // Connect DOM elements
        this.dom.input = document.getElementById("prompt-input");
        this.dom.button = document.getElementById("prompt-submit");
        this.dom.output = document.getElementById("output-display");
        this.dom.chamber = document.getElementById("chamber-core");

        // Attach components
        this.promptInput.attach(this.dom.input, this.dom.button);
        this.outputDisplay.attach(this.dom.output);
        this.chamberCore.attach(this.dom.chamber);

        // Start reactive loop
        this.startRenderLoop();
    }

    startRenderLoop() {
        const render = () => {
            this.outputDisplay.render();
            this.chamberCore.render();
            requestAnimationFrame(render);
        };

        requestAnimationFrame(render);
    }
}
