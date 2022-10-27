/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  shell,
} = require('electron');
const path = require('path');
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { initializeAppConfigStore } from './Store';
import {
  resolveHtmlPath,
  RESOURCES_PATH,
  isDevelopment,
  operatingSystem,
  quitApp,
} from './util';
import { CreateTray } from './utils/tray';
import { setKeyboardShortcuts } from './utils/ShortcutHandlers/setKeyboardShortcuts';
import {
  hideWindow,
  showWindow,
  windowExists,
} from './utils/windowhandlers';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let tray;
let win = null;
let store = initializeAppConfigStore();

const getAssetPath = (...paths) => {
  return path.join(RESOURCES_PATH, ...paths);
};
let iconPath = getAssetPath('withub-16.ico');


function toggleWindow() {
  try {
    if (win.isVisible()) {
      // if (window.isFocused()) {
      hideWindow(win);
      // } else {
      // showWindow(window);
      // }
    } else {
      showWindow(win);
    }
  } catch (error) {
    console.log('toggleWindow');
    win = createWindow();
    showWindow(win);
  }
  console.log('showKBAR');
  // win.webContents.send('showKBar');
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  // Create win, load the rest of the app, etc...
  app.on('ready', () => {
    win = new BrowserWindow({
      transparent: true,
      width: 1000,
      height: 600,
      show: false,
      skipTaskbar: true,
      icon: iconPath,
      frame: false,
      titleBarStyle: 'customButtonsOnHover',
      minimizable: false,
      // resizable: false,
      maximizable: false,
      center: true,
      useContentSize: true,
      autoHideMenuBar: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
      },
    });

    win.on('close', () => {
      log.info('Closing window: ');
      win = null;
    });

    win.loadURL(resolveHtmlPath('index.html'));

    win.once('ready-to-show', () => {
      log.info('ready-to-show: ');
      showWindow(win);

      // hide traffic light buttons
      if (operatingSystem === 'darwin') {
        win.setWindowButtonVisibility(false);
      }
      // win.webContents.openDevTools();
      win.webContents.send('windowId', win?.id);
      store.set('winId', win?.id);
    });
    //Handles the disappear on outside click functionality
    win.on('blur', () => {
      log.info('blur');
      hideWindow(win);
    });

    app.on('window-all-closed', () => {
      log.info('window-all-closed');
      globalShortcut.unregisterAll();
      if (process.platform !== 'darwin') {
        log.info('window-all-closed, quiting app: ');
        app.quit();
      }
    });

    const ret = globalShortcut.register('Alt+E', () => {
      log.info('registering shortcut: ' + globalShortcut.isRegistered('Alt+E'));
      toggleWindow()
    });
    if (!ret) {
      log.error('registration failed');
    }
    setKeyboardShortcuts(win);

    app.getFileIcon(path.join(RESOURCES_PATH, 'icons', 'withub-16.png'));

    tray = CreateTray();

    app.on('will-quit', () => {
      // Unregister all shortcuts.
      globalShortcut.unregisterAll();
      log.info('will-quit: ');
    });

    app.on('before-quit', () => {
      if (win) {
        win.removeAllListeners('close');
        win.close();
      }
      log.info('before-quit: ');
    });

    win.on('restore', (e) => {
      win.setSize(1000, 600);
    });  //workaround for issue in windowhandler.js

    win.webContents.on('new-window', (event, url) => {
      if (!url.includes('api.usewithub.com/')) {
        event.preventDefault();
        shell.openExternal(url);
      } else {
        showWindow(win);
      }
    });

    new AppUpdater();
  });
}
