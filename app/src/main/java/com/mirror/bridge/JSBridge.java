package com.mirror.bridge;

import android.webkit.JavascriptInterface;

public class JSBridge {

    private final String modelName;
    private final WebViewManager manager;

    public JSBridge(String modelName, WebViewManager manager) {
        this.modelName = modelName;
        this.manager = manager;
    }

    @JavascriptInterface
    public void onAIResponse(String content) {
        manager.handleAIResponse(modelName, content);
    }

    @JavascriptInterface
    public void onLog(String message) {
        manager.handleLog(modelName, message);
    }
}
