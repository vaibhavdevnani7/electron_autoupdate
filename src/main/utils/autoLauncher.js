import AutoLaunch from 'auto-launch';
import { showWindow } from '../windowHandlers/windowHandlers';
import { app } from 'electron';
import { operatingSystem } from '../util';

export const AutoLaunchOnStartup = (mainWindow) => {
    var withubAutoLauncher = new AutoLaunch({
        name: 'withub',
        path:
        operatingSystem === 'win32'
        ? app.getPath('exe')
        : '/Applications/WitHub.app',
    });
    withubAutoLauncher.enable();
    
    withubAutoLauncher.isEnabled().then(function (isEnabled) {
        if (isEnabled) {
            return showWindow(mainWindow);
        }
        withubAutoLauncher.enable();
    });   
}