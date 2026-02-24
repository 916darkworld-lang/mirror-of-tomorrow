/**
 * BRAIN STARTUP FILE
 * This is the ignition key for your entire system.
 * It starts the brain, the engines, and the bridge.
 */

console.log("🧠 Starting IAI Brain...");

// 1. Load Engines
const MemoryEngine = require("../backend/memory/MemoryManager.js");
const ConsensusEngine = require("../backend/orchestrator/ConsensusEngine.js");
const Orchestrator = require("../backend/orchestrator/multiai orchestrator.js");

// 2. Create Instances
const memory = new MemoryEngine();
const consensus = new ConsensusEngine();
const orchestrator = new Orchestrator(memory, consensus);

// 3. Start the Bridge Server
const WebSocket = require("ws");
const PORT = 3030;

const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log(`🔌 Bridge running on ws://localhost:${PORT}`);
});

// 4. Handle Connections
wss.on("connection", (ws) => {
    console.log("⚡ Frontend connected to brain");

    // Send brain ready signal
    ws.send(JSON.stringify({ type: "brainReady" }));

    // Handle messages from frontend
    ws.on("message", async (msg) => {
        const data = JSON.parse(msg);

        if (data.type === "userPrompt") {
            const result = await orchestrator.process(data.prompt);
            ws.send(JSON.stringify({ type: "brainResponse", result }));
        }
    });
});

console.log("🚀 Brain fully initialized");
