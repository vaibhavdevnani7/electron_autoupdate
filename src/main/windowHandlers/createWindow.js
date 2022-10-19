import { BrowserWindow, app, screen, shell } from 'electron';
import path from 'path';
import { operatingSystem, resolveHtmlPath } from '../util';
import { AppUpdater } from 'electron-updater';
import glob from 'glob';
import {
  DIRECTORIES,
  EXTENSIONS,
  formatPath,
} from '../AppLauncher/windows/windows';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import uniq from 'lodash/uniq';
import { showWindow, hideWindow } from './windowHandlers';
import { initializeAppConfigStore } from '../Store';
import log from 'electron-log';
import { centerWindow, getWindowBoundsCentered } from 'electron-util';
import { rehydrateHookstate } from '../storeHandlers/eventHandlers/storeEventHandlersMain';

const createWindow = () => {
  // if (isDevelopment) {
  //   await installExtensions();
  // }
  let window;
  let store = initializeAppConfigStore();
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  //  console.log(getAssetPath('withub-16.png'));
  let iconPath = getAssetPath('withub-16.ico');
  // let factor = screen.getPrimaryDisplay().scaleFactor
  window = new BrowserWindow({
    backgroundColor: '#24292e',
    width: 960,
    height: 620,
    show: false,
    skipTaskbar: true,
    icon: iconPath,
    movable: true,
    alwaysOnTop: true,
    frame: false,
    center: true,
    titleBarStyle: 'customButtonsOnHover',
    // TODO: change these to `false` for production
    resizable: false,
    maximizable: false,
    // paintWhenInitiallyHidden: false,
    minimizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  window.loadURL(resolveHtmlPath('index.html'));
  // window.id = 1;
  // Don't show until we are ready and loaded

  window.once('ready-to-show', () => {
    // TODO: rehydrateHookstate (or not needed as we can get a message back from the renderer) [and then start sync jobs scheduling]
    // rehydrateHookstate(window);

    showWindow(window);
    // hide traffic light buttons
    if (operatingSystem === 'darwin') {
      window.setWindowButtonVisibility(false);
    }
    window.webContents.openDevTools();
    window.webContents.send('windowId', window?.id);
    store.set('mainWindowId', window?.id);
  });
  //Handles the disappear on outside click functionality
  window.on('blur', () => {
    hideWindow(window);
  });
  //to open urls in browser instead of new electron window, bypass a url if you want it to open in electron window
  window.webContents.on('new-window', (event, url) => {
    if (!url.includes('api.usewithub.com/')) {
      event.preventDefault();
      shell.openExternal(url);
    } else {
      showWindow(window);
    }
  });

  // Emitted when the window is closed.
  window.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    window = null;
  });
  // eslint-disable-next-line
  new AppUpdater();
  return window;
};

export default createWindow;
