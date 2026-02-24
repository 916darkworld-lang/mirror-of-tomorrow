/**
 * Bridge Connection (Frontend)
 * ----------------------------
 * Connects the UI to the IAI Brain via WebSocket.
 */

class BridgeConnection {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.handlers = {};
    }

    connect() {
        this.ws = new WebSocket("ws://localhost:3030");

        this.ws.onopen = () => {
            console.log("🔌 Bridge connected");
            this.isConnected = true;
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "bridgeReady") {
                console.log("🟢 Bridge is ready");
            }

            if (data.type === "brainReady") {
                console.log("🧠 Brain is ready");
                this.trigger("brainReady");
            }

            if (data.type === "brainResponse") {
                this.trigger("brainResponse", data.result);
            }
        };

        this.ws.onclose = () => {
            console.log("🔴 Bridge disconnected");
            this.isConnected = false;
        };
    }

    sendPrompt(prompt) {
        if (!this.isConnected) {
            console.warn("Bridge not connected");
            return;
        }

        this.ws.send(JSON.stringify({
            type: "userPrompt",
            prompt
        }));
    }

    on(event, callback) {
        this.handlers[event] = callback;
    }

    trigger(event, payload) {
        if (this.handlers[event]) {
            this.handlers[event](payload);
        }
    }
}

export default new BridgeConnection();
