const { contextBridge, ipcRenderer } = require('electron');

// Expose a one-way channel so the main process can forward its own errors
// (uncaught exceptions, unhandled rejections) to the renderer's error modal.
contextBridge.exposeInMainWorld('electronBridge', {
  onMainError: (callback) => {
    ipcRenderer.on('main-process-error', (_event, message) => callback(message));
  }
});
