import { autoUpdater } from 'electron-updater';
import { dialog } from 'electron';
import { isDevelopment} from './../util'

if(!isDevelopment){   
    autoUpdater.on('update-downloaded', () => {
        dialog.showMessageBox({
            title: 'Install Updates',
            message: 'Updates downloaded, application will be quit for update...',
        });
        autoUpdater.quitAndInstall();
    });
    
}