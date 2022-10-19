import log from 'electron-log';
import { screen, BrowserWindow} from 'electron';
import { initializeAppConfigStore } from '../Store';
import log from 'electron-log';
import { getWindowBoundsCentered , centerWindow} from 'electron-util';
import { hideWindow, showWindow, windowExists } from './windowHandlers';

// TODO: maybe we don't need to pass mainWindow as a parameter here [or get it when this is caled using `getWindowById()`]
export const resizeWindow = (windowState , mainWindow) => {
    mainWindow.resizable = true;
    // hideWindow(mainWindow)
    // TODO: use scale factor when tailwind is dynamic
    // let factor = screen.getPrimaryDisplay().scaleFactor
    if ( windowState === 'resizefull') {
      // let bounds = getWindowBoundsCentered(mainWindow)
      console.log("bounds");
      // this seems to have sorted the "cannot read getSize of null" error
      let mainWindow = getWindowById();
      mainWindow.setBounds({width: 1300, height: 840 }, false)
      centerWindow(mainWindow , true)

      // centerWindow(mainWindow)
    } else if (windowState === 'resizeKBar') {
        // mainWindow.setBounds({ width: 960, height: 620 }, true)
        // this seems to have sorted the "cannot read getSize of null" error
        let mainWindow = getWindowById();
        mainWindow.setBounds({width: 960, height: 620 }, false)
        centerWindow(mainWindow, true)
      }
    // showWindow(mainWindow)
    mainWindow.resizable = false;
    return 'successfully resized';

  }

  // export const resizeWindow = (windowState , mainWindow) => {
  //   mainWindow.resizable = true;
  //   const primaryDisplayX = screen.getPrimaryDisplay();
  //   const { x, y, width, height } = primaryDisplayX.workArea;
  //   // hideWindow(mainWindow)
  //   if ( windowState === 'resizefull') {
  //     mainWindow.setBounds({ x, y, width, height })
  //     mainWindow.setFullScreen(true)
  //     // centerWindow(mainWindow)
  //   } else if ( windowState === 'resizeKBar') {
  //     mainWindow.setFullScreen(false)
  //     try {
  //       mainWindow.setBounds({width: 960, height: 620 }, true);
  //       // mainWindow.setBounds({ width: 960, height: 620 }, true)
  //       centerWindow(mainWindow)

  //     } catch (error) {
  //       log.error("couldnt set bounds, settings size and position [hacky override?]", error);
  //       mainWindow.setBounds(960 , 620);
  //       centerWindow(mainWindow)

  //     }
  //   }
  //   // showWindow(mainWindow)
  //   mainWindow.resizable = false;
  //   return 'successfully resized';

  // }

  export const getWindowById = () => {
    let store = initializeAppConfigStore()
    let mainWindowId = store.get('mainWindowId')
    if(mainWindowId){
      let window = BrowserWindow.fromId(mainWindowId)
      return window
    } else {
      return null
    }
  }

  export const setShowPosition = (window) => {
    if(window !== undefined && window !== null){
      let bounds = getWindowBoundsCentered(window)
      console.log("bounds", bounds)
      window.setBounds(bounds)
    }
  }
  //CODE TAKEN FROM MAIN
      // TODO: center window on screen (be it primary display or external/secondary display)
    // TODO: put all of this after we initialize the main window (`mainWindow`)
    // get primary monitor
    // const primaryDisplay = screen.getPrimaryDisplay();
    // const { width: primaryDisplayFullScreenWidth, height: primaryDisplayFullScreenHeight } = primaryDisplay.size;
    // const { width: primaryDisplayWorkAreaWidth, height: primaryDisplayWorkAreaHeight } = primaryDisplay.workAreaSize;
    // log.info('primary monitor workAreaSize', { primaryDisplayWorkAreaWidth, primaryDisplayFullScreenHeight });
    // log.info('primary monitor fullScreenSize', { primaryDisplayFullScreenWidth, primaryDisplayFullScreenHeight });
    // log.info("primary monitor aspect ratio", primaryDisplayFullScreenWidth / primaryDisplayFullScreenHeight);
    // // const windowScreen = screen.getDisplayNearestPoint({ windowX, windowY });
    // // log.info('main window position', { windowX, windowY });
    // // log.info('main window screen', windowScreen);
    // // get all monitors
    // const displays = screen.getAllDisplays()
    // const externalDisplay = displays.find((display) => {
    //   return display.bounds.x !== 0 || display.bounds.y !== 0
    // })
    // if (externalDisplay) {
    //   // let testWindow = new BrowserWindow({
    //   //   x: externalDisplay.bounds.x + 50,
    //   //   y: externalDisplay.bounds.y + 50
    //   // });
    //   // testWindow.loadURL('https://github.com');
    //   log.info("we have external display", externalDisplay);
    // }
