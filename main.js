const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { ipcMain } = require('electron/main');
const TodoService = require('./actions/TodoService');
const FormData = require('form-data');
const { default: axios } = require('axios');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: 'My buddy app',
    width: 1500,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.webContents.openDevTools();

  const startUrl = url.format({
    pathname: path.join(__dirname, './app/build/index.html'),
    protocol: 'file',
  });

  mainWindow.loadURL('http://localhost:3000');
}

app.whenReady().then(createMainWindow);

ipcMain.on("deleteFile", (event, filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      event.reply("deleteFileResponse", { success: false, error: err.message });
    } else {
      event.reply("deleteFileResponse", { success: true });
    }
  });
});

ipcMain.on("renameFile", (event, { oldPath, newPath }) => {
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      event.reply("renameFileResponse", { success: false, error: err.message });
    } else {
      event.reply("renameFileResponse", { success: true });
    }
  });
});



// ipcMain.on('submit:todoForm', async (e, opt) => {
//   const data = await TodoService.handleTodoFormSubmit(opt);
//   mainWindow.webContents.send('task:added', { task: data });
// });
ipcMain.on('addFile', async (e, opt) => {
  fs.writeFile(opt.path, opt.content, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 
});
