package com.mirror.bridge;

import android.app.Activity;
import android.webkit.WebView;

import java.util.HashMap;
import java.util.Map;

public class WebViewManager {

    private final WebView chatgptView;
    private final WebView geminiView;
    private final WebView copilotView;
    private final WebView claudeView;
    private final WebView perplexityView;

    private final Activity activity;

    private final Map<String, String> responses = new HashMap<>();

    public interface ResponseListener {
        void onAIResponse(String modelName, String content);
    }

    private ResponseListener listener;

    public void setResponseListener(ResponseListener listener) {
        this.listener = listener;
    }

    public WebViewManager(
            WebView chatgptView,
            WebView geminiView,
            WebView copilotView,
            WebView claudeView,
            WebView perplexityView,
            Activity activity
    ) {
        this.chatgptView = chatgptView;
        this.geminiView = geminiView;
        this.copilotView = copilotView;
        this.claudeView = claudeView;
        this.perplexityView = perplexityView;
        this.activity = activity;

        injectManagerScript(chatgptView);
        injectManagerScript(geminiView);
        injectManagerScript(copilotView);
        injectManagerScript(claudeView);
        injectManagerScript(perplexityView);
    }

    private void injectManagerScript(WebView view) {
        view.evaluateJavascript(loadManagerScript(), null);
        view.evaluateJavascript("WebViewManager.observeResponses()", null);
    }

    private String loadManagerScript() {
        return AssetLoader.load(activity, "WebViewManager.js");
    }

    public void broadcastPrompt(String prompt) {
        injectPrompt(chatgptView, prompt);
        injectPrompt(geminiView, prompt);
        injectPrompt(copilotView, prompt);
        injectPrompt(claudeView, prompt);
        injectPrompt(perplexityView, prompt);
    }

    private void injectPrompt(WebView view, String prompt) {
        String js = "WebViewManager.injectPrompt(" + escape(prompt) + ")";
        view.evaluateJavascript(js, null);
    }

    private String escape(String text) {
        return "\"" + text.replace("\"", "\\\"") + "\"";
    }

    public void handleAIResponse(String modelName, String content) {
        responses.put(modelName, content);

        if (listener != null) {
            listener.onAIResponse(modelName, content);
        }
    }

    public void handleLog(String modelName, String message) {
        // Optional logging hook
    }
}
