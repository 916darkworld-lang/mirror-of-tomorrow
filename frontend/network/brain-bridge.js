export class BrainBridge {
    constructor(url) {
        this.socket = new WebSocket(url);
        this.ready = false;
        this.onBrainResponse = null;

        this.socket.onopen = () => {
            console.log("Connected to Brain WebSocket");
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "bridgeReady") {
                this.ready = true;
                console.log("Brain bridge ready");
            }

            if (data.type === "brainResponse" && this.onBrainResponse) {
                this.onBrainResponse(data.result);
            }
        };
    }

    send(payload) {
        if (!this.ready) {
            console.warn("Brain bridge not ready yet");
            return;
        }

        this.socket.send(JSON.stringify(payload));
    }
}
