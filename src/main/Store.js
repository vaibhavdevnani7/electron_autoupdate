import Store from 'electron-store';

// this should solve our `initRenderer is not called` issue?
// TODO: import just this into main.js?
// Store.initRenderer();

// TODO: put all of this in renderer??
export const initializeAppConfigStore = () => {
  // store for app local config (mostly electron main process)
  const defaultConfig = {
    shortcuts: {
      dummy1: '',
      dummy2: '',
    },
    settings: {
      dummy1: 'something',
      dummy2: 'something else',
    },
    mainWindowId: 0,
    toggleKBarState: '',
  };
  const store = new Store({
    defaults: defaultConfig,
    name: 'app-config-store',
  });
  return store;
};

export const initializeAppStateStore = () => {
  // store for app state (mostly electron renderer process)
  const defaultState = {
    // TODO: add our state schema here (from hookstate [store.js])
    default: {
      dummy1: 'first dummy state',
      dummy2: 'second dummy state',
    },
  };
  const appStateStore = new Store({
    defaults: defaultState,
    name: 'app-state-store',
  });
  return appStateStore;
};

export const initializeAppCacheStore = () => {
  // store for app local cache (mostly electron rendere process)
  const defaultCache = {
    cacheDefaults: {
      dummy1: 'first dummy cache',
      dummy2: 'second dummy cache',
    },
  };
  const appCacheStore = new Store({
    defaults: defaultCache,
    name: 'app-cache-store',
  });
  return appCacheStore;
};
