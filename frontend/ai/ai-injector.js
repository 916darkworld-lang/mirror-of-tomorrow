/**
 * AI Window Listener Injector
 * ---------------------------
 * Injects ai-window-listener.js into each AI iframe
 * after it finishes loading.
 */

export function injectListenerInto(frame) {
    const script = document.createElement("script");
    script.src = "/frontend/ai/ai-window-listener.js";
    script.type = "text/javascript";

    // Inject script into iframe
    frame.contentWindow.document.head.appendChild(script);
}
