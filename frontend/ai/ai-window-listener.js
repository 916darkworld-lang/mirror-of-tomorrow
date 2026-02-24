/**
 * AI Window Listener
 * ------------------
 * Runs INSIDE each AI iframe.
 * Listens for prompts from the parent window,
 * sends them into the AI UI, extracts the response,
 * and returns it through MessageChannel.
 */

window.addEventListener("message", async (event) => {
    const data = event.data;

    if (data.type !== "aiPrompt") return;

    const port = event.ports[0];
    const prompt = data.prompt;

    try {
        // 1. Insert prompt into the AI's textbox
        const input = document.querySelector("textarea, input[type='text']");
        if (!input) {
            port.postMessage("ERROR: No input box found");
            return;
        }

        input.value = prompt;
        input.dispatchEvent(new Event("input", { bubbles: true }));

        // 2. Click the send button
        const sendBtn = document.querySelector("button[type='submit'], button");
        if (sendBtn) sendBtn.click();

        // 3. Wait for AI response to appear
        const response = await waitForAIResponse();

        // 4. Send the response back to parent
        port.postMessage(response);

    } catch (err) {
        port.postMessage("ERROR: " + err.message);
    }
});

/**
 * Waits for the AI to generate a response.
 * This is a generic watcher that works for most AI UIs.
 */
function waitForAIResponse() {
    return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            const messages = Array.from(
                document.querySelectorAll(".message, .chat-message, p")
            ).map(el => el.innerText.trim())
             .filter(Boolean);

            if (messages.length > 0) {
                observer.disconnect();
                resolve(messages[messages.length - 1]);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
