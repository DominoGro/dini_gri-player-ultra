const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { execFile } = require('child_process');

let win;

const AUDIO_EXT = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.opus'];

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#05070f',
    title: 'DINI GRI PLAYER',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.setMenuBarVisibility(false);
  win.loadFile(path.join(__dirname, 'src', 'index.html'));
  // win.webContents.openDevTools(); // odkomentuj do debugowania
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/* ============ skanowanie folderu po pliki audio (rekurencyjnie) ============ */
function scanDir(dir, out, depth = 0) {
  if (depth > 8) return;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch (e) { return; }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    try {
      if (ent.isDirectory()) {
        if (ent.name.startsWith('.')) continue;
        scanDir(full, out, depth + 1);
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase();
        if (AUDIO_EXT.includes(ext)) {
          const st = fs.statSync(full);
          out.push({ path: full, name: ent.name, size: st.size, mtime: st.mtimeMs });
        }
      }
    } catch (e) { /* pomiń niedostępne */ }
  }
}

/* IPC: wybór folderu przez systemowe okno */
ipcMain.handle('pick-folder', async () => {
  const res = await dialog.showOpenDialog(win, {
    title: 'Wybierz folder z muzyką',
    properties: ['openDirectory']
  });
  if (res.canceled || !res.filePaths.length) return null;
  const dir = res.filePaths[0];
  const files = [];
  scanDir(dir, files);
  return { dir, files };
});

/* IPC: wybór pojedynczych plików */
ipcMain.handle('pick-files', async () => {
  const res = await dialog.showOpenDialog(win, {
    title: 'Wybierz pliki muzyczne',
    properties: ['openFile', 'multiSelections'],
    filters: [{ name: 'Audio', extensions: AUDIO_EXT.map(e => e.slice(1)) }]
  });
  if (res.canceled || !res.filePaths.length) return null;
  const files = res.filePaths.map(p => {
    const st = fs.statSync(p);
    return { path: p, name: path.basename(p), size: st.size, mtime: st.mtimeMs };
  });
  return { files };
});

/* IPC: ponowne przeskanowanie zapamiętanej ścieżki przy starcie */
ipcMain.handle('scan-path', async (e, dir) => {
  if (!dir || !fs.existsSync(dir)) return null;
  const files = [];
  scanDir(dir, files);
  return { dir, files };
});

/* IPC: odczyt pliku audio jako Buffer (do odtwarzania/analizy) */
ipcMain.handle('read-file', async (e, filePath) => {
  try {
    const buf = fs.readFileSync(filePath);
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  } catch (err) {
    return null;
  }
});

/* ============ wykrywanie podłączonych nośników (pendrive) ============ */
function listRemovableLinux() {
  // typowe miejsca montowania USB na Linux
  const mounts = [];
  const bases = [
    path.join('/media', os.userInfo().username),
    '/media',
    '/run/media/' + os.userInfo().username,
    '/mnt'
  ];
  for (const base of bases) {
    try {
      if (!fs.existsSync(base)) continue;
      for (const name of fs.readdirSync(base)) {
        const full = path.join(base, name);
        try {
          if (fs.statSync(full).isDirectory()) mounts.push({ name, path: full });
        } catch (e) {}
      }
    } catch (e) {}
  }
  return mounts;
}

function listRemovableWindows() {
  // litery dysków C..Z, pomijamy C (zwykle systemowy)
  const drives = [];
  for (let c = 68; c <= 90; c++) { // D..Z
    const letter = String.fromCharCode(c) + ':\\';
    try {
      if (fs.existsSync(letter)) drives.push({ name: letter, path: letter });
    } catch (e) {}
  }
  return drives;
}

ipcMain.handle('list-drives', async () => {
  if (process.platform === 'win32') return listRemovableWindows();
  return listRemovableLinux();
});

/* skan konkretnego nośnika */
ipcMain.handle('scan-drive', async (e, drivePath) => {
  if (!drivePath || !fs.existsSync(drivePath)) return null;
  const files = [];
  scanDir(drivePath, files);
  return { dir: drivePath, files };
});
