import { app, screen } from 'electron';
// import createWindow from './createWindow';
import { operatingSystem } from '../util';
import { initializeAppConfigStore } from '../Store';
import { getWindowBoundsCentered, centerWindow } from 'electron-util';

export const windowExists = (window) => {
  // if window exists and is not detroyed return true
  if (window) {
    if (!window.isDestroyed()) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

// TODO: fix screen flash on macOS when window was on first screen, and mouse goes to second screen and it is activated there
export const showWindow = (window) => {
  if (window !== undefined && window !== null) {
    let store = initializeAppConfigStore();
    if (window.isVisible()) {
      if (operatingSystem === 'darwin') {
        window.focus();
      } else if (operatingSystem === 'win32') {
        window.focus();
      }
    } else {
      // console.log('window not visible');
      // this is a workaround to restore the focus on the previously focussed window
      if (operatingSystem === 'darwin') {
        // console.log('showWindow on macOS');
        app.show();
        // workaround to make window work across multiple desktops/workspaces
        window.setVisibleOnAllWorkspaces(true);
        window.show();
        window.focus();
        window.setVisibleOnAllWorkspaces(false);
      }
      if (operatingSystem === 'win32') {
        window.restore();
        window.show();
        window.focus();
      }
    }
    store.set('toggleKBarState', 'on');
  }
};

export const hideWindow = (window) => {
  let store = initializeAppConfigStore();
  setTimeout(() => {
    if (windowExists(window)) {
      // this is a workaround to restore the focus on the previously focussed window
      if (operatingSystem === 'win32') {
        window.minimize();   //electron-issue, causes window to resize after each toggle(workaround in main.js to restore size on restore)
      }
      // this is a workaround to restore the focus on the previously focussed window
      if (operatingSystem === 'darwin') {
        // TODO: figure out why this is called twice
        console.log('hideWindow on macOS');
        app.hide();
      }
      window.hide();
      store.set('toggleKBarState', 'off');
    } else {
      console.log('window does not exist');
    }
  }, 25);
};
