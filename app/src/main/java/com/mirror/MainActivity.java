package com.mirror;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

import com.mirror.bridge.JSBridge;
import com.mirror.bridge.WebViewManager;

public class MainActivity extends AppCompatActivity {

    private WebView chatgptView;
    private WebView geminiView;
    private WebView copilotView;
    private WebView claudeView;
    private WebView perplexityView;

    private WebViewManager manager;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        chatgptView = new WebView(this);
        geminiView = new WebView(this);
        copilotView = new WebView(this);
        claudeView = new WebView(this);
        perplexityView = new WebView(this);

        setupWebView(chatgptView);
        setupWebView(geminiView);
        setupWebView(copilotView);
        setupWebView(claudeView);
        setupWebView(perplexityView);

        manager = new WebViewManager(
                chatgptView,
                geminiView,
                copilotView,
                claudeView,
                perplexityView,
                this
        );

        chatgptView.addJavascriptInterface(new JSBridge("chatgpt", manager), "AndroidBridge");
        geminiView.addJavascriptInterface(new JSBridge("gemini", manager), "AndroidBridge");
        copilotView.addJavascriptInterface(new JSBridge("copilot", manager), "AndroidBridge");
        claudeView.addJavascriptInterface(new JSBridge("claude", manager), "AndroidBridge");
        perplexityView.addJavascriptInterface(new JSBridge("perplexity", manager), "AndroidBridge");

        chatgptView.loadUrl("https://chat.openai.com");
        geminiView.loadUrl("https://gemini.google.com");
        copilotView.loadUrl("https://copilot.microsoft.com");
        claudeView.loadUrl("https://claude.ai");
        perplexityView.loadUrl("https://www.perplexity.ai");

        setContentView(chatgptView);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView(WebView view) {
        WebSettings settings = view.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUserAgentString(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        view.setWebViewClient(new WebViewClient());
    }
}
