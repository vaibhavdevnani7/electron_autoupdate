import { app } from 'electron'
import { isDevelopment, operatingSystem } from '../util';
import { showWindow } from '../windowHandlers/windowHandlers';
import createWindow from '../windowHandlers/createWindow';

export const setDefaultProtocolClient = () => {
    if (isDevelopment && operatingSystem === 'win32') {
        // Set the path of electron.exe and your app.
        // These two additional parameters are only available on windows.
        // Setting this is required to get this working in dev mode.
        console.log('path app', app.getAppPath());

        app.setAsDefaultProtocolClient('withub', process.execPath, [
            app.getAppPath(),
        ]);
    } else {
        app.setAsDefaultProtocolClient('withub');
    }
}

export const secondInstanceHandler = (gotTheLock , deeplinkingUrl , mainWindow) => {

  if (!gotTheLock) {
        app.quit();
        return;
      } else {
        app.on('second-instance', (e, argv) => {
          if (operatingSystem !== 'darwin') {
            // Find the arg that is our custom protocol url and store it
            deeplinkingUrl = argv.find((arg) => arg.startsWith('withub://'));
            console.log('second-instance', deeplinkingUrl);
          }

          if (mainWindow) {
            //send deeplinkingUrl to renderer with webcontent
            mainWindow.webContents.send('appConnected', deeplinkingUrl);
            showWindow(mainWindow);
          } else {
            mainWindow = createWindow();
            mainWindow.webContents.send('appConnected', deeplinkingUrl);
            showWindow(mainWindow);
          }
        });
      }
}

export const openUrlHandler = (mainWindow , deeplinkingUrl) => {
  var appName = deeplinkingUrl.substring(deeplinkingUrl.indexOf(':') + 3, deeplinkingUrl.lastIndexOf('/'));
  console.log("appName", appName)
  if (mainWindow) {
    if(appName.includes('SignIn')){
    mainWindow.webContents.send('signedIn', deeplinkingUrl);
    showWindow(mainWindow);
  } else {
    mainWindow.webContents.send('appConnected', deeplinkingUrl);
    showWindow(mainWindow);
  }
    //send deeplinkingUrl to renderer with webcontent
    // showWindow(mainWindow);
  } else {
    mainWindow = createWindow();
    if(appName.includes('SignIn')){
      mainWindow.webContents.send('signedIn', deeplinkingUrl);
      showWindow(mainWindow);
    } else {
      mainWindow.webContents.send('appConnected', deeplinkingUrl);
      showWindow(mainWindow);
    }
    // showWindow(mainWindow);
  }
}
