const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  setIgnoreMouseEvents: (ignore) => ipcRenderer.send('set-ignore-mouse-events', ignore),
  setSystemVolume: (val) => ipcRenderer.send('set-system-volume', val),
  setSystemBrightness: (val) => ipcRenderer.send('set-system-brightness', val)
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('PRODUCTIVEDUDE desktop context loaded.');
});
