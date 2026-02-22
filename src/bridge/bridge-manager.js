const { BrowserWindow } = require('electron');

class BridgeManager {
  constructor(controlWindow, aiWindows) {
    this.controlWindow = controlWindow;
    this.aiWindows = aiWindows;

    this.responses = {};
    this.expectedModels = Object.keys(aiWindows);
  }

  // Broadcast prompt to all AI windows
  broadcastPrompt(prompt) {
    for (const [modelName, win] of Object.entries(this.aiWindows)) {
      try {
        win.webContents.send('inject-prompt', {
          modelName,
          prompt
        });
      } catch (err) {
        console.error(`Failed to send prompt to ${modelName}:`, err);
      }
    }
  }

  // Handle incoming AI responses
  handleAIResponse(payload) {
    const { modelName, content } = payload;

    // Forward partial response to control window
    this.controlWindow.webContents.send('ai-response', {
      modelName,
      content
    });

    // Store for consensus
    this.responses[modelName] = content;

    // Check if all models responded
    if (this._allModelsResponded()) {
      const finalAnswer = this._computeConsensus();
      this.controlWindow.webContents.send('consensus-result', {
        finalAnswer
      });

      // Reset for next prompt
      this.responses = {};
    }
  }

  // Window control commands
  handleWindowCommand(command) {
    for (const win of Object.values(this.aiWindows)) {
      switch (command) {
        case 'minimize-all':
          win.minimize();
          break;
        case 'maximize-all':
          win.maximize();
          break;
        case 'restore-all':
          win.restore();
          break;
        case 'hide-all':
          win.hide();
          break;
        case 'show-all':
          win.show();
          break;
      }
    }
  }

  // Check if all AI windows responded
  _allModelsResponded() {
    return this.expectedModels.every((m) => this.responses[m]);
  }

  // Simple consensus engine (placeholder)
  _computeConsensus() {
    const all = Object.values(this.responses);
    if (all.length === 0) return '';

    // Basic consensus: longest answer wins
    let best = all[0];
    for (const ans of all) {
      if (ans.length > best.length) best = ans;
    }
    return best;
  }
}

module.exports = BridgeManager;
