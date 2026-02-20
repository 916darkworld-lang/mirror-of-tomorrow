const { ConsensusEngine } = require('../core/consensus-engine');
const { AgreementEngine } = require('../core/agreement-engine');
const { AutoRefinementController } = require('../core/auto-refinement-controller');

class BridgeManager {
  constructor(controlWindow, aiWindows) {
    this.controlWindow = controlWindow;
    this.aiWindows = aiWindows;

    this.responses = {};
    this.expectedModels = Object.keys(aiWindows);

    this.agreementEngine = new AgreementEngine();
    this.consensusEngine = new ConsensusEngine(this.agreementEngine);
    this.autoRefine = new AutoRefinementController(this.consensusEngine);

    this.setupListeners();
  }

  setupListeners() {
    // When preload scripts send AI responses
    for (const modelName of this.expectedModels) {
      this.aiWindows[modelName].webContents.on('ipc-message', (event, channel, data) => {
        if (channel === 'ai-response') {
          this.handleAIResponse({
            modelName,
            content: data
          });
        }
      });
    }
  }

  broadcastPrompt(prompt) {
    this.responses = {};

    for (const modelName of this.expectedModels) {
      const win = this.aiWindows[modelName];
      if (!win || win.isDestroyed()) continue;

      win.webContents.send('inject-prompt', prompt);
    }
  }

  handleAIResponse(payload) {
    const { modelName, content } = payload;

    this.responses[modelName] = {
      modelName,
      content
    };

    // Notify control window of partial updates
    this.controlWindow.webContents.send('partial-response', {
      modelName,
      content
    });

    // If all models have responded, run consensus
    if (Object.keys(this.responses).length === this.expectedModels.length) {
      this.runConsensus();
    }
  }

  async runConsensus() {
    const responsesArray = Object.values(this.responses);

    const result = await this.consensusEngine.remix({
      domain: 'general',
      responses: responsesArray,
      targetAgreement: 0.98,
      previousState: null,
      includedModels: this.expectedModels
    });

    this.controlWindow.webContents.send('consensus-result', {
      finalAnswer: result.finalAnswer,
      agreement: result.agreement
    });
  }

  handleWindowCommand(command) {
    switch (command) {
      case 'minimize-all':
        for (const win of Object.values(this.aiWindows)) win.minimize();
        break;

      case 'maximize-all':
        for (const win of Object.values(this.aiWindows)) win.maximize();
        break;

      case 'restore-all':
        for (const win of Object.values(this.aiWindows)) win.restore();
        break;

      case 'hide-all':
        for (const win of Object.values(this.aiWindows)) win.hide();
        break;

      case 'show-all':
        for (const win of Object.values(this.aiWindows)) win.show();
        break;
    }
  }
}

module.exports = BridgeManager;
