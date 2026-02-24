import WebSocket, { WebSocketServer } from "ws";
import Orchestrator from "./orchestrator.js";

const wss = new WebSocketServer({ port: 3030 });

console.log("Brain WebSocket running on ws://localhost:3030");

wss.on("connection", (ws) => {
    console.log("Frontend connected to Brain");

    ws.send(JSON.stringify({ type: "bridgeReady" }));

    ws.on("message", async (msg) => {
        const data = JSON.parse(msg);

        if (data.type === "userPrompt") {
            const result = await Orchestrator.processPrompt(data.prompt);

            ws.send(JSON.stringify({
                type: "brainResponse",
                result
            }));
        }
    });

    ws.send(JSON.stringify({ type: "brainReady" }));
});
