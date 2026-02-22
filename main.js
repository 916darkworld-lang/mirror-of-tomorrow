const { app, BrowserWindow } = require("electron");

function createAIWindow(name, url, x, y) {
  const win = new BrowserWindow({
    width: 900,
    height: 1000,
    x,
    y,
    title: name,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  win.loadURL(url);
  return win;
}

app.whenReady().then(() => {
  createAIWindow("ChatGPT", "https://chat.openai.com", 0, 0);
  createAIWindow("Claude", "https://claude.ai", 920, 0);
  createAIWindow("Grok", "https://x.com/i/grok", 1840, 0);
  createAIWindow("Copilot", "https://copilot.microsoft.com", 0, 1020);
  createAIWindow("Gemini", "https://gemini.google.com", 920, 1020);
  createAIWindow("Perplexity", "https://www.perplexity.ai", 1840, 1020);
});

app.on("window-all-closed", () => {
  app.quit();
});
