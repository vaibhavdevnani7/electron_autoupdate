/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import {
  resolveHtmlPath,
  RESOURCES_PATH,
  isDevelopment,
  operatingSystem,
  quitApp,
} from './util';
import { hideWindow, showWindow } from './windowHandlers/windowHandlers';
import { registerGlobalKeyboardShortcut } from './WithubSetup/ShortcutHandlers/registerGlobalKeyboardShortcut';
import { setKeyboardShortcuts } from './WithubSetup/ShortcutHandlers/setKeyboardShortcuts';
import { centerWindow } from 'electron-util';
import { CreateTray } from './WithubSetup/tray';
import { setDefaultProtocolClient } from './WithubSetup/defaultProtocolHandler';
import { openUrlHandler } from './WithubSetup/defaultProtocolHandler';
import { secondInstanceHandler } from './WithubSetup/defaultProtocolHandler';
import createWindow from './windowHandlers/createWindow';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

var mainWindow: any;
let tray;
let deeplinkingUrl;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const toggleWindow = () => {
  try {
    if (mainWindow.isVisible()) {
      // if (window.isFocused()) {
      hideWindow(mainWindow);
      // } else {
      // showWindow(window);
      // }
    } else {
      showWindow(mainWindow);
    }
  } catch (error) {
    console.log('toggleWindow');
    mainWindow = createWindow();
    showWindow(mainWindow);
  }
  console.log('showKBAR');
  // mainWindow.webContents.send('showKBar');
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    //global shortcut toggle
    registerGlobalKeyboardShortcut(toggleWindow);
    //in window shortcuts
    setKeyboardShortcuts();
    // enforce macOS application location to prevent read-only app launch [prompts user to move app to Applications folder, if not already there]
    // enforceMacOSAppLocation();
    // appIcon
    app.getFileIcon(path.join(RESOURCES_PATH, 'icons', 'withub-16.png'));
    tray = CreateTray();
  })
  .then(() => {
    // updater.enabled = false;
    if (!isDevelopment) {
      autoUpdater.checkForUpdates();
    }
    mainWindow = createWindow();

    //should fix open window on launch
    // if (windowExists(mainWindow)) {
    //   mainWindow.isVisible() ? hideWindow(mainWindow) : showWindow(mainWindow);
    // } else {
    //   mainWindow = createWindow();
    //   showWindow(mainWindow);
    // }

    app.on('activate', () => {
      if (mainWindow === null) {
        mainWindow = createWindow();
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });
app.on('browser-window-focus', () => {
  centerWindow(mainWindow);
});
app.on('ready', () => {
  // mainWindowID = getMainWindowId(mainWindow)
  setDefaultProtocolClient();
});

app.on('open-url', function (event, url) {
  event.preventDefault();
  deeplinkingUrl = url;
  console.log('open-url', deeplinkingUrl);
  openUrlHandler(mainWindow, deeplinkingUrl);
});

// Force single application instance
const gotTheLock = app.requestSingleInstanceLock();
secondInstanceHandler(gotTheLock, deeplinkingUrl, mainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // TODO: fix bug where on-top and focus properties of our window are lost
  if (operatingSystem !== 'darwin') {
    quitApp();
    // app.hide();
  }
});
