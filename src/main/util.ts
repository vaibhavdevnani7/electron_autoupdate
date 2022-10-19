/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { app, globalShortcut } from 'electron';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const operatingSystem = process.platform;

export const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

export const quitApp = () => {
  try {
    globalShortcut.unregisterAll();
  } catch (e) {
    console.log(e);
  }
  app.quit();
};

export const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
