import { Menu } from "electron";
import { hideWindow } from "../../windowHandlers/windowHandlers";
import { quitApp } from "../../util";

export const setKeyboardShortcuts = (mainWindow) => {

    const reloadApp = () => {
        mainWindow?.reload();
      };
    const hideApp = () => {
        // console.log('hideApp');
        if (mainWindow?.isVisible()) {
          if (mainWindow?.isFocused()) {
            hideWindow(mainWindow);
          }
        } else {
          hideWindow(mainWindow);
        }
      }

    const template = [
      {
        label: 'withub',
        submenu: [
          { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: hideApp },
          { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: reloadApp },
          { label: 'QuitWindows', accelerator: 'Alt+F4', click: hideApp },
          { label: 'Escape', accelerator: 'Escape', click: hideApp },
          // { label: "Toggle Developer Tools", accelerator: "F12", click: toggleDevTools },
          // { label: "F12", accelerator: "F12", click: toggleDevTools },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
          { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
          { type: 'separator' },
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
          {
            label: 'Select All',
            accelerator: 'CmdOrCtrl+A',
            selector: 'selectAll:',
          },
        ],
      },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  };
