const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('controlBridge', {
  sendPrompt: (prompt) => {
    ipcRenderer.send('broadcast-prompt', prompt);
  },

  minimizeAll: () => {
    ipcRenderer.send('window-control', 'minimize-all');
  },

  maximizeAll: () => {
    ipcRenderer.send('window-control', 'maximize-all');
  },

  restoreAll: () => {
    ipcRenderer.send('window-control', 'restore-all');
  },

  hideAll: () => {
    ipcRenderer.send('window-control', 'hide-all');
  },

  showAll: () => {
    ipcRenderer.send('window-control', 'show-all');
  },

  onPartialResponse: (callback) => {
    ipcRenderer.on('partial-response', (event, payload) => {
      callback(payload);
    });
  },

  onConsensusResult: (callback) => {
    ipcRenderer.on('consensus-result', (event, payload) => {
      callback(payload);
    });
  }
});
