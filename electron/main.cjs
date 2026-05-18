// Minimal Electron entry that opens the Vite-built `dist/` as a desktop app.
// Run with `npm run electron:dev` after `npm install`.

const { app, BrowserWindow, Menu } = require('electron');
const path = require('node:path');

let mainWindow = null;

function sendErrorToRenderer(message) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('main-process-error', message);
  }
}

function formatError(err) {
  if (err instanceof Error) {
    return err.stack || `${err.name}: ${err.message}`;
  }
  return String(err);
}

process.on('uncaughtException', (err) => {
  console.error('[main] uncaughtException:', err);
  sendErrorToRenderer(`[Main process] Uncaught Exception:\n${formatError(err)}`);
});

process.on('unhandledRejection', (reason) => {
  console.error('[main] unhandledRejection:', reason);
  sendErrorToRenderer(`[Main process] Unhandled Rejection:\n${formatError(reason)}`);
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: '#fdfbff',
    title: 'Crochet Pattern Designer',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.on('closed', () => { mainWindow = null; });

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  mainWindow.loadFile(indexPath);
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
