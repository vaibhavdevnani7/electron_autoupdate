import { Menu } from "electron";
import { quitApp } from "../../util";
import {
  hideWindow,
  showWindow,
  windowExists,
} from '../windowhandlers';
export const setKeyboardShortcuts = (mainWindow) => {

    const reloadApp = () => {
        mainWindow?.reload();
      };
    const hideApp = () => {
        hideWindow(mainWindow)
      }

    const template = [
      {
        label: 'withub',
        submenu: [
          { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: hideApp },
          { label: 'Reload', accelerator: 'CmdOrCtrl+R', click: reloadApp },
          { label: 'QuitWindows', accelerator: 'Alt+F4', click: hideApp },
          { label: 'Escape', accelerator: 'Escape', click: hideApp },
        ]
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
