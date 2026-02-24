/**
 * App Startup Controller
 * ----------------------
 * Handles:
 *  - waiting for bridge + brain readiness
 *  - unlocking the UI
 *  - initializing AI windows
 *  - wiring the send button to the bridge
 */

import bridge from "../bridge/bridge-connection.js";
import AIWindows from "../ai/ai-windows.js";

class AppStartup {
    constructor() {
        this.ready = false;
    }

    init() {
        console.log("🚀 App startup initialized");

        // 1. Connect to the bridge
        bridge.connect();

        // 2. Wait for brain readiness
        bridge.on("brainReady", () => {
            console.log("🧠 Brain ready — unlocking UI");
            this.unlockUI();
            this.initAIWindows();
        });

        // 3. Handle brain responses
        bridge.on("brainResponse", (result) => {
            this.displayOutput(result.final);
        });

        // 4. Wire send button
        this.setupSendButton();
    }

    unlockUI() {
        const lock = document.getElementById("startup-lock");
        if (lock) lock.style.display = "none";
        this.ready = true;
    }

    initAIWindows() {
        AIWindows.loadAll();
    }

    setupSendButton() {
        const input = document.getElementById("user-input");
        const btn = document.getElementById("send-btn");

        btn.addEventListener("click", () => {
            if (!this.ready) return;

            const prompt = input.value.trim();
            if (!prompt) return;

            bridge.sendPrompt(prompt);
            input.value = "";
        });
    }

    displayOutput(text) {
        const out = document.getElementById("output");
        out.innerText = text;
    }
}

export default new AppStartup();
