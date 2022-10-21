import { Menu , Tray , app } from "electron";
import path from "path";
import { operatingSystem, quitApp } from "../util";
import { RESOURCES_PATH } from "../util";
import { autoUpdater } from 'electron-updater';

export const CreateTray = () => {
    let tray 
    if (operatingSystem === 'win32') {
        tray = new Tray(path.join(RESOURCES_PATH, 'icons', 'withub-32.png'));
      } else {
        tray = new Tray(path.join(RESOURCES_PATH, 'icons', 'withub-16.png'));
        app.dock.hide();
      }
      //Context Menu
      const contextMenu = Menu.buildFromTemplate([
        { label: 'Request a Feature', type: 'radio' },
        {
          label: 'Check for Updates',
          type: 'normal',
          click: () => {
              //TODO: put this in after cleanup
            autoUpdater.checkForUpdatesAndNotify();
          },
        },
        {
          label: 'Quit App',
          type: 'normal',
          click: () => {
            quitApp();
          },
        },
      ]);
      tray.setToolTip('WitHub');
      tray.setContextMenu(contextMenu);
      // tray.on("click", () => {
      //   // showWindow(mainWindow)
      //   // updater.enabled = false;
      //   autoUpdater.checkForUpdatesAndNotify()
      // })
      return tray
}