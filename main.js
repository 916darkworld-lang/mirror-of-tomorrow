const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const BridgeManager = require('./src/bridge/bridge-manager');

let bridgeManager = null;

function createWindows() {
  // Control Window (Main UI)
  const controlWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'src/bridge/preload-control.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  controlWindow.loadFile('src/windows/control-window.html');

  // AI Windows
  const windows = {
    chatgpt: new BrowserWindow({
      width: 900,
      height: 1000,
      show: true,
      webPreferences: {
        preload: path.join(__dirname, 'src/bridge/preload-chatgpt.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    }),
    gemini: new BrowserWindow({
      width: 900,
      height: 1000,
      show: true,
      webPreferences: {
        preload: path.join(__dirname, 'src/bridge/preload-gemini.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    }),
    copilot: new BrowserWindow({
      width: 900,
      height: 1000,
      show: true,
      webPreferences: {
        preload: path.join(__dirname, 'src/bridge/preload-copilot.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    }),
    claude: new BrowserWindow({
      width: 900,
      height: 1000,
      show: true,
      webPreferences: {
        preload: path.join(__dirname, 'src/bridge/preload-claude.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    }),
    perplexity: new BrowserWindow({
      width: 900,
      height: 1000,
      show: true,
      webPreferences: {
        preload: path.join(__dirname, 'src/bridge/preload-perplexity.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    })
  };

  // Load real AI websites
  windows.chatgpt.loadURL('https://chat.openai.com');
  windows.gemini.loadURL('https://gemini.google.com');
  windows.copilot.loadURL('https://copilot.microsoft.com');
  windows.claude.loadURL('https://claude.ai');
  windows.perplexity.loadURL('https://www.perplexity.ai');

  // Initialize bridge manager
  bridgeManager = new BridgeManager(controlWindow, windows);

  // IPC wiring
  ipcMain.on('broadcast-prompt', (event, prompt) => {
    bridgeManager.broadcastPrompt(prompt);
  });

  ipcMain.on('ai-response', (event, payload) => {
    bridgeManager.handleAIResponse(payload);
  });

  ipcMain.on('window-control', (event, command) => {
    bridgeManager.handleWindowCommand(command);
  });
}

app.whenReady().then(() => {
  createWindows();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindows();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
