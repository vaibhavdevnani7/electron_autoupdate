import { isDevelopment } from '../util';

export const devtoolInstaller = () => {
    if (process.env.NODE_ENV === 'production') {
        const sourceMapSupport = require('source-map-support');
        sourceMapSupport.install();
      }
      
      
      if (isDevelopment) {
        require('electron-debug')();
      }
      
      
      const installExtensions = async () => {
        const installer = require('electron-devtools-installer');
        const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
        const extensions = ['REACT_DEVELOPER_TOOLS'];
      
        return installer
          .default(
            extensions.map((name) => installer[name]),
            forceDownload
          )
          .catch(console.log);
      };
      
}