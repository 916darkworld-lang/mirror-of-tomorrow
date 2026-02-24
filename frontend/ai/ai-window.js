/**
 * AIWindow
 * --------
 * Wraps an AI iframe and provides a clean interface
 * for sending prompts and receiving responses.
 */

export class AIWindow {
    constructor(windowRef) {
        this.windowRef = windowRef;
    }

    /**
     * Sends a prompt into the AI iframe and waits for the response.
     */
    async sendPrompt(prompt) {
        return new Promise((resolve) => {
            const channel = new MessageChannel();

            // When the iframe responds, resolve the promise
            channel.port1.onmessage = (event) => {
                resolve(event.data);
            };

            // Send the prompt into the iframe
            this.windowRef.postMessage(
                {
                    type: "aiPrompt",
                    prompt
                },
                "*",
                [channel.port2]
            );
        });
    }
}
