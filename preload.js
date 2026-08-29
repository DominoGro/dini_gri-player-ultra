const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  isDesktop: true,
  pickFolder: () => ipcRenderer.invoke('pick-folder'),
  pickFiles: () => ipcRenderer.invoke('pick-files'),
  scanPath: (dir) => ipcRenderer.invoke('scan-path', dir),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
  listDrives: () => ipcRenderer.invoke('list-drives'),
  scanDrive: (drivePath) => ipcRenderer.invoke('scan-drive', drivePath)
});
