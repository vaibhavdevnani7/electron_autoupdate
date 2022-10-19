import { globalShortcut} from "electron";
import { isDevelopment } from "../../util";


export const registerGlobalKeyboardShortcut = (toggleAction) => {
  if (isDevelopment) {
    globalShortcut.unregister('Alt+E');
    globalShortcut.unregisterAll();
    globalShortcut.register('Alt+E', toggleAction);
  } else {
    globalShortcut.unregister('CmdOrCtrl+E');
    globalShortcut.unregisterAll();
    // Add actual key
    // TODO: disappear on outside click! [@mc-stack88]
    // TODO: apply main.css draggable hack [@mc-stack88]
    globalShortcut.register('CmdOrCtrl+E', toggleAction);
  }
}




