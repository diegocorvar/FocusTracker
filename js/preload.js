const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendTaskToInsert: (data) => ipcRenderer.invoke('insert-task', data),
    sendTaskToRename: (data) => ipcRenderer.invoke('rename-task', data),
    sendTaskToDelete: (data) => ipcRenderer.invoke('delete-task', data)
})