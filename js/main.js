const { app, BrowserWindow, ipcMain } = require("electron/main");
const {
    insertNewTask,
    updateTaskName,
    deleteTask,
    completeTask,
    incompleteTask
} = require('./taskController.js');

const path = require("node:path");

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        autoHideMenuBar: true,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    win.loadFile("./html/index.html");
    win.maximize();
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.handle('insert-task', async (event, taskData) => {
    const generatedId = await insertNewTask(taskData);
    return generatedId;
});

ipcMain.handle('rename-task', async (event, taskData) => {
    const result = await updateTaskName(taskData);
    return result;
});

ipcMain.handle('delete-task', async (event, taskData) => {
    const result = await deleteTask(taskData);
    return result;
});

ipcMain.handle('complete-task', async (event, taskData) => {
    const result = await completeTask(taskData);
    return result;
});

ipcMain.handle('incomplete-task', async (event, taskData) => {
    const result = await incompleteTask(taskData);
    return result;
});
