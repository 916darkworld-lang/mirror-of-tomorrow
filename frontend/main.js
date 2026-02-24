import AIWindows from "./ai/ai-windows.js";
import { injectListenerInto } from "./ai/ai-injector.js";
import { LoopController } from "./loop/loop-controller.js";
import { UIController } from "./ui/ui-controller.js";
import { BrainBridge } from "./network/brain-bridge.js";

window.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Initializing Multi‑AI System...");

    // 1. Load UI
    const ui = new UIController();

    // 2. Load AI windows
    AIWindows.loadAll();

    // 3. Inject listeners into each iframe when ready
    const grid = document.getElementById("ai-grid");
    const observer = new MutationObserver(() => {
        const frames = grid.querySelectorAll("iframe");

        frames.forEach(frame => {
            if (!frame.dataset.injected) {
                try {
                    injectListenerInto(frame);
                    frame.dataset.injected = "true";
                    console.log(`Injected listener into ${frame.dataset.ai}`);
                } catch (err) {
                    console.warn("Injection failed:", err);
                }
            }
        });
    });

    observer.observe(grid, { childList: true, subtree: true });

    // 4. Connect to backend brain
    const brain = new BrainBridge("ws://localhost:3030");

    // 5. Create loop controller
    const loop = new LoopController(brain.socket, ui);

    // 6. Wire the Send button
    const sendBtn = document.getElementById("sendBtn");
    const promptInput = document.getElementById("promptInput");

    sendBtn.addEventListener("click", async () => {
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        ui.showStatus("Running multi‑AI debate loop...");

        const result = await loop.runUntilAgreement(prompt);

        ui.updateSummary(result.summary);
        ui.showStatus("Debate loop complete.");
    });
});
